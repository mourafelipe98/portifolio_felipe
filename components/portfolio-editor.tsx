"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { savePortfolioData, saveColors, loadColors, type PortfolioData } from "@/lib/storage-service"
import { isSupabaseConfigured } from "@/lib/supabase"
import {
  Save,
  X,
  User,
  Contact,
  BarChart3,
  Briefcase,
  Award,
  FolderOpen,
  Plus,
  Trash2,
  Loader2,
  FileText,
  Globe,
  Palette,
} from "lucide-react"
import type {
  ProfileData,
  Stat,
  Experience,
  SkillCategory,
  Case,
  Certification,
  ColorScheme,
  Education,
} from "@/lib/storage-service"

interface PortfolioEditorProps {
  initialData: {
    profileData: ProfileData
    stats: (Stat & { icon: any })[]
    experiences: Experience[]
    skillCategories: Record<string, SkillCategory & { icon: any }>
    cases: Case[]
    certifications: Certification[]
    education: Education[]
  }
  onClose: () => void
  onSave: () => void
}

export default function PortfolioEditor({ initialData, onClose, onSave }: PortfolioEditorProps) {
  const [profileData, setProfileData] = useState<ProfileData>(initialData.profileData)
  const [stats, setStats] = useState(initialData.stats)
  const [experiences, setExperiences] = useState<Experience[]>(initialData.experiences)
  const [skillCategories, setSkillCategories] = useState(initialData.skillCategories)
  const [cases, setCases] = useState<Case[]>(initialData.cases)
  const [certifications, setCertifications] = useState<Certification[]>(initialData.certifications)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const [colors, setColors] = useState<ColorScheme>({
    primary: "#1F4E79",
    secondary: "#A8D5BA",
    accent: "#F4C430",
    background: "#F8FAFC",
  })

  const colorPresets = [
    { name: "Azul Profissional", primary: "#1F4E79", secondary: "#A8D5BA", accent: "#F4C430", background: "#F8FAFC" },
    { name: "Verde Moderno", primary: "#059669", secondary: "#A7F3D0", accent: "#FCD34D", background: "#F0FDF4" },
    { name: "Roxo Criativo", primary: "#7C3AED", secondary: "#C4B5FD", accent: "#F59E0B", background: "#FAF5FF" },
    { name: "Vermelho Dinâmico", primary: "#DC2626", secondary: "#FCA5A5", accent: "#FBBF24", background: "#FEF2F2" },
    { name: "Cinza Elegante", primary: "#374151", secondary: "#D1D5DB", accent: "#10B981", background: "#F9FAFB" },
  ]

  // Load current colors when editor opens
  useEffect(() => {
    const loadCurrentColors = async () => {
      const currentColors = await loadColors()
      if (currentColors) {
        setColors(currentColors)
      }
    }
    loadCurrentColors()
  }, [])

  // Functions to update experiences
  const updateExperience = (index: number, field: string, value: string) => {
    const newExperiences = [...experiences]
    newExperiences[index] = { ...newExperiences[index], [field]: value }
    setExperiences(newExperiences)
  }

  const updateExperienceAchievement = (expIndex: number, achievementIndex: number, value: string) => {
    const newExperiences = [...experiences]
    const newAchievements = [...newExperiences[expIndex].achievements]
    newAchievements[achievementIndex] = value
    newExperiences[expIndex] = { ...newExperiences[expIndex], achievements: newAchievements }
    setExperiences(newExperiences)
  }

  const addExperienceAchievement = (expIndex: number) => {
    const newExperiences = [...experiences]
    newExperiences[expIndex].achievements.push("Nova realização")
    setExperiences(newExperiences)
  }

  const removeExperienceAchievement = (expIndex: number, achievementIndex: number) => {
    const newExperiences = [...experiences]
    newExperiences[expIndex].achievements.splice(achievementIndex, 1)
    setExperiences(newExperiences)
  }

  const updateExperienceMetric = (expIndex: number, metricIndex: number, field: string, value: string) => {
    const newExperiences = [...experiences]
    const newMetrics = [...newExperiences[expIndex].metrics]
    newMetrics[metricIndex] = { ...newMetrics[metricIndex], [field]: value }
    newExperiences[expIndex] = { ...newExperiences[expIndex], metrics: newMetrics }
    setExperiences(newExperiences)
  }

  const addExperienceMetric = (expIndex: number) => {
    const newExperiences = [...experiences]
    newExperiences[expIndex].metrics.push({ key: "new", value: "Nova métrica" })
    setExperiences(newExperiences)
  }

  const removeExperienceMetric = (expIndex: number, metricIndex: number) => {
    const newExperiences = [...experiences]
    newExperiences[expIndex].metrics.splice(metricIndex, 1)
    setExperiences(newExperiences)
  }

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        title: "Nova Experiência",
        company: "Empresa",
        period: "Data - Data",
        description: "Descrição da experiência",
        achievements: ["Nova realização"],
        metrics: [{ key: "metric", value: "valor" }],
      },
    ])
  }

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index))
  }

  // Functions to update stats
  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setStats(newStats)
  }

  // Functions for skills
  const addSkillToCategory = (category: string, skill: string) => {
    if (skill.trim()) {
      setSkillCategories((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          skills: [...prev[category].skills, skill.trim()],
        },
      }))
    }
  }

  const removeSkillFromCategory = (category: string, skillIndex: number) => {
    setSkillCategories((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        skills: prev[category].skills.filter((_, index) => index !== skillIndex),
      },
    }))
  }

  // Functions for cases
  const updateCase = (index: number, field: string, value: string) => {
    const newCases = [...cases]
    newCases[index] = { ...newCases[index], [field]: value }
    setCases(newCases)
  }

  const addCase = () => {
    setCases([
      ...cases,
      {
        title: "Novo Case",
        description: "Descrição do case",
        link: "https://",
        tags: ["Tag1"],
      },
    ])
  }

  const removeCase = (index: number) => {
    setCases(cases.filter((_, i) => i !== index))
  }

  const updateCaseTag = (caseIndex: number, tagIndex: number, value: string) => {
    const newCases = [...cases]
    const newTags = [...newCases[caseIndex].tags]
    newTags[tagIndex] = value
    newCases[caseIndex] = { ...newCases[caseIndex], tags: newTags }
    setCases(newCases)
  }

  const addCaseTag = (caseIndex: number) => {
    const newCases = [...cases]
    newCases[caseIndex].tags.push("Nova tag")
    setCases(newCases)
  }

  const removeCaseTag = (caseIndex: number, tagIndex: number) => {
    const newCases = [...cases]
    newCases[caseIndex].tags.splice(tagIndex, 1)
    setCases(newCases)
  }

  // Functions for certifications
  const updateCertification = (index: number, field: string, value: string) => {
    const newCertifications = [...certifications]
    newCertifications[index] = { ...newCertifications[index], [field]: value }
    setCertifications(newCertifications)
  }

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        title: "Nova Certificação",
        link: "https://",
      },
    ])
  }

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index))
  }

  const [education, setEducation] = useState<Education[]>(initialData.education || [])

  // Functions for education
  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setEducation(newEducation)
  }

  const addEducation = () => {
    setEducation([
      ...education,
      {
        degree: "Nova Formação",
        institution: "Instituição",
        period: "Período",
      },
    ])
  }

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index))
  }

  const handleSavePortfolioData = async () => {
    try {
      setIsSaving(true)

      // Convert skill categories to save format
      const skillCategoriesForSave = Object.entries(skillCategories).reduce(
        (acc, [key, value]: [string, any]) => {
          acc[key] = {
            ...value,
            icon: value.icon.name || "Database", // Save icon name instead of component
          }
          return acc
        },
        {} as Record<string, SkillCategory>,
      )

      // Convert stats to save format
      const statsForSave = stats.map((stat) => ({
        ...stat,
        icon: stat.icon.name || "Target",
      }))

      const dataToSave: PortfolioData = {
        profile_data: profileData,
        stats: statsForSave,
        experiences,
        skill_categories: skillCategoriesForSave,
        cases,
        certifications,
        education,
        colors,
      }

      const success = await savePortfolioData(dataToSave)
      const colorsSuccess = await saveColors(colors)

      if (success && colorsSuccess) {
        toast({
          title: "Dados salvos!",
          description: isSupabaseConfigured
            ? "Suas informações foram salvas com sucesso."
            : "Suas informações foram salvas localmente neste navegador.",
        })
        onSave()
      } else {
        throw new Error("Falha ao salvar dados")
      }
    } catch (error) {
      console.error("Erro ao salvar dados:", error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)

      // Aplicar cores
      document.documentElement.style.setProperty("--primary-color", colors.primary)
      document.documentElement.style.setProperty("--secondary-color", colors.secondary)
      document.documentElement.style.setProperty("--accent-color", colors.accent)
      document.documentElement.style.setProperty("--background-color", colors.background)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-[95%] h-[95%] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b flex items-center justify-between" style={{ backgroundColor: "#A8D5BA" }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#1F4E79" }}>
              Editar Portfólio
            </h2>
            <p className="mt-1 font-inter" style={{ color: "#5A7184" }}>
              Faça alterações nas suas informações profissionais
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          <Tabs defaultValue="profile" orientation="vertical" className="w-full flex">
            {/* Sidebar */}
            <div className="w-72 border-r flex flex-col" style={{ backgroundColor: "#F4F6F8" }}>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: "#1F4E79" }}>
                  Seções
                </h3>
                <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-2 p-0">
                  <TabsTrigger
                    value="profile"
                    className="w-full justify-start h-12 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 data-[state=active]:border-gray-300 rounded-md"
                    style={
                      {
                        "--tw-data-state-active-bg": "#A8D5BA",
                        "--tw-data-state-active-color": "#1F4E79",
                      } as any
                    }
                  >
                    <User className="w-4 h-4 mr-3" />
                    Informações Pessoais
                  </TabsTrigger>
                  <TabsTrigger
                    value="contact"
                    className="w-full justify-start h-12 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 data-[state=active]:border-gray-300 rounded-md"
                    style={
                      {
                        "--tw-data-state-active-bg": "#A8D5BA",
                        "--tw-data-state-active-color": "#1F4E79",
                      } as any
                    }
                  >
                    <Contact className="w-4 h-4 mr-3" />
                    Contato
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="w-full justify-start h-12 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 data-[state=active]:border-gray-300 rounded-md"
                    style={
                      {
                        "--tw-data-state-active-bg": "#A8D5BA",
                        "--tw-data-state-active-color": "#1F4E79",
                      } as any
                    }
                  >
                    <BarChart3 className="w-4 h-4 mr-3" />
                    Estatísticas
                  </TabsTrigger>
                  <TabsTrigger
                    value="experience"
                    className="w-full justify-start h-12 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 data-[state=active]:border-gray-300 rounded-md"
                    style={
                      {
                        "--tw-data-state-active-bg": "#A8D5BA",
                        "--tw-data-state-active-color": "#1F4E79",
                      } as any
                    }
                  >
                    <Briefcase className="w-4 h-4 mr-3" />
                    Experiência
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="w-full justify-start h-12 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 data-[state=active]:border-gray-300 rounded-md"
                    style={
                      {
                        "--tw-data-state-active-bg": "#A8D5BA",
                        "--tw-data-state-active-color": "#1F4E79",
                      } as any
                    }
                  >
                    <Award className="w-4 h-4 mr-3" />
                    Habilidades
                  </TabsTrigger>
                  <TabsTrigger
                    value="cases"
                    className="w-full justify-start h-12 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 data-[state=active]:border-gray-300 rounded-md"
                    style={
                      {
                        "--tw-data-state-active-bg": "#A8D5BA",
                        "--tw-data-state-active-color": "#1F4E79",
                      } as any
                    }
                  >
                    <FolderOpen className="w-4 h-4 mr-3" />
                    Cases & Projetos
                  </TabsTrigger>
                  <TabsTrigger
                    value="education"
                    className="w-full justify-start h-12 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 data-[state=active]:border-gray-300 rounded-md"
                    style={
                      {
                        "--tw-data-state-active-bg": "#A8D5BA",
                        "--tw-data-state-active-color": "#1F4E79",
                      } as any
                    }
                  >
                    <Award className="w-4 h-4 mr-3" />
                    Formação
                  </TabsTrigger>
                  <TabsTrigger
                    value="certifications"
                    className="w-full justify-start h-12 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 data-[state=active]:border-gray-300 rounded-md"
                    style={
                      {
                        "--tw-data-state-active-bg": "#A8D5BA",
                        "--tw-data-state-active-color": "#1F4E79",
                      } as any
                    }
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    Certificações
                  </TabsTrigger>
                  <TabsTrigger
                    value="links"
                    className="w-full justify-start h-12 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 data-[state=active]:border-gray-300 rounded-md"
                    style={
                      {
                        "--tw-data-state-active-bg": "#A8D5BA",
                        "--tw-data-state-active-color": "#1F4E79",
                      } as any
                    }
                  >
                    <Globe className="w-4 h-4 mr-3" />
                    Links & Rodapé
                  </TabsTrigger>
                  <TabsTrigger
                    value="colors"
                    className="w-full justify-start h-12 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 data-[state=active]:border-gray-300 rounded-md"
                    style={
                      {
                        "--tw-data-state-active-bg": "#A8D5BA",
                        "--tw-data-state-active-color": "#1F4E79",
                      } as any
                    }
                  >
                    <Palette className="w-4 h-4 mr-3" />
                    Cores & Tema
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <ScrollArea className="h-full">
                <div className="p-8 max-w-4xl mx-auto">
                  <TabsContent value="profile" className="space-y-8 mt-0">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2" style={{ color: "#1F4E79" }}>
                        Informações Pessoais
                      </h2>
                      <p className="font-inter" style={{ color: "#5A7184" }}>
                        Edite suas informações básicas do perfil
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                          Nome Completo
                        </Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="h-12"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                          Título Profissional
                        </Label>
                        <Input
                          id="title"
                          value={profileData.title}
                          onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                          className="h-12"
                          placeholder="Seu cargo ou área de atuação"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label htmlFor="cvUrl" className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                          Link do CV
                        </Label>
                        <Input
                          id="cvUrl"
                          value={profileData.cvUrl}
                          onChange={(e) => setProfileData({ ...profileData, cvUrl: e.target.value })}
                          className="h-12"
                          placeholder="https://drive.google.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="contactEmail"
                          className="text-sm font-medium font-inter"
                          style={{ color: "#5A7184" }}
                        >
                          Email de Contato
                        </Label>
                        <Input
                          id="contactEmail"
                          value={profileData.contactEmail}
                          onChange={(e) => setProfileData({ ...profileData, contactEmail: e.target.value })}
                          className="h-12"
                          placeholder="seu.email@exemplo.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="summary" className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                        Resumo Profissional
                      </Label>
                      <Textarea
                        id="summary"
                        value={profileData.summary}
                        onChange={(e) => setProfileData({ ...profileData, summary: e.target.value })}
                        rows={6}
                        className="resize-none"
                        placeholder="Descreva sua experiência e objetivos profissionais..."
                      />
                    </div>

                    <Button className="w-full h-12 btn-primary" onClick={handleSavePortfolioData} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Salvar Informações Pessoais
                    </Button>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-8 mt-0">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2" style={{ color: "#1F4E79" }}>
                        Informações de Contato
                      </h2>
                      <p className="font-inter" style={{ color: "#5A7184" }}>
                        Edite suas informações de contato
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="h-12"
                          placeholder="seu.email@exemplo.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                          Telefone
                        </Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="h-12"
                          placeholder="+55 (11) 99999-9999"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label
                          htmlFor="location"
                          className="text-sm font-medium font-inter"
                          style={{ color: "#5A7184" }}
                        >
                          Localização
                        </Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          className="h-12"
                          placeholder="Cidade, Estado"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="linkedin"
                          className="text-sm font-medium font-inter"
                          style={{ color: "#5A7184" }}
                        >
                          LinkedIn
                        </Label>
                        <Input
                          id="linkedin"
                          value={profileData.linkedin}
                          onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                          className="h-12"
                          placeholder="linkedin.com/in/seuperfil"
                        />
                      </div>
                    </div>

                    <Button className="w-full h-12 btn-primary" onClick={handleSavePortfolioData} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Salvar Informações de Contato
                    </Button>
                  </TabsContent>

                  <TabsContent value="stats" className="space-y-8 mt-0">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2" style={{ color: "#1F4E79" }}>
                        Estatísticas
                      </h2>
                      <p className="font-inter" style={{ color: "#5A7184" }}>
                        Edite suas estatísticas profissionais
                      </p>
                    </div>

                    <div className="space-y-6">
                      {stats.map((stat, index) => (
                        <Card key={index} className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                Rótulo
                              </Label>
                              <Input
                                value={stat.label}
                                onChange={(e) => updateStat(index, "label", e.target.value)}
                                className="h-12"
                                placeholder="Ex: Projetos Liderados"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                Valor
                              </Label>
                              <Input
                                value={stat.value}
                                onChange={(e) => updateStat(index, "value", e.target.value)}
                                className="h-12"
                                placeholder="Ex: 15+"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Button className="w-full h-12 btn-primary" onClick={handleSavePortfolioData} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Salvar Estatísticas
                    </Button>
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-8 mt-0">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold mb-2" style={{ color: "#1F4E79" }}>
                          Experiência Profissional
                        </h2>
                        <p className="font-inter" style={{ color: "#5A7184" }}>
                          Edite suas experiências profissionais
                        </p>
                      </div>
                      <Button onClick={addExperience} className="btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>

                    <div className="space-y-8">
                      {experiences.map((exp, expIndex) => (
                        <Card key={expIndex} className="p-6">
                          <div className="flex items-start justify-between mb-6">
                            <h3 className="text-lg font-semibold" style={{ color: "#1F4E79" }}>
                              Experiência {expIndex + 1}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeExperience(expIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                  Título
                                </Label>
                                <Input
                                  value={exp.title}
                                  onChange={(e) => updateExperience(expIndex, "title", e.target.value)}
                                  className="h-12"
                                  placeholder="Cargo | Área"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                  Empresa
                                </Label>
                                <Input
                                  value={exp.company}
                                  onChange={(e) => updateExperience(expIndex, "company", e.target.value)}
                                  className="h-12"
                                  placeholder="Nome da empresa"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                Período
                              </Label>
                              <Input
                                value={exp.period}
                                onChange={(e) => updateExperience(expIndex, "period", e.target.value)}
                                className="h-12"
                                placeholder="janeiro de 2020 - dezembro de 2022"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                Descrição
                              </Label>
                              <Textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(expIndex, "description", e.target.value)}
                                rows={4}
                                className="resize-none"
                                placeholder="Descrição das responsabilidades e atividades..."
                              />
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                  Principais Realizações
                                </Label>
                                <Button variant="outline" size="sm" onClick={() => addExperienceAchievement(expIndex)}>
                                  <Plus className="w-4 h-4 mr-1" />
                                  Adicionar
                                </Button>
                              </div>
                              {exp.achievements.map((achievement, achIndex) => (
                                <div key={achIndex} className="flex gap-2">
                                  <Input
                                    value={achievement}
                                    onChange={(e) => updateExperienceAchievement(expIndex, achIndex, e.target.value)}
                                    className="h-10"
                                    placeholder="Descreva uma realização..."
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeExperienceAchievement(expIndex, achIndex)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                  Métricas
                                </Label>
                                <Button variant="outline" size="sm" onClick={() => addExperienceMetric(expIndex)}>
                                  <Plus className="w-4 h-4 mr-1" />
                                  Adicionar
                                </Button>
                              </div>
                              {exp.metrics.map((metric, metricIndex) => (
                                <div key={metricIndex} className="flex gap-2">
                                  <Input
                                    value={metric.key}
                                    onChange={(e) =>
                                      updateExperienceMetric(expIndex, metricIndex, "key", e.target.value)
                                    }
                                    className="h-10"
                                    placeholder="Chave"
                                  />
                                  <Input
                                    value={metric.value}
                                    onChange={(e) =>
                                      updateExperienceMetric(expIndex, metricIndex, "value", e.target.value)
                                    }
                                    className="h-10"
                                    placeholder="Valor"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeExperienceMetric(expIndex, metricIndex)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Button className="w-full h-12 btn-primary" onClick={handleSavePortfolioData} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Salvar Experiências
                    </Button>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-8 mt-0">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2" style={{ color: "#1F4E79" }}>
                        Habilidades & Competências
                      </h2>
                      <p className="font-inter" style={{ color: "#5A7184" }}>
                        Edite suas habilidades por categoria
                      </p>
                    </div>

                    <div className="space-y-8">
                      {Object.entries(skillCategories).map(([category, data]) => (
                        <Card key={category} className="p-6">
                          <h3 className="text-lg font-semibold mb-4" style={{ color: "#1F4E79" }}>
                            {category}
                          </h3>
                          <div className="space-y-4">
                            {data.skills.map((skill, skillIndex) => (
                              <div key={skillIndex} className="flex gap-2">
                                <Input
                                  value={skill}
                                  onChange={(e) => {
                                    const newSkills = [...data.skills]
                                    newSkills[skillIndex] = e.target.value
                                    setSkillCategories((prev) => ({
                                      ...prev,
                                      [category]: { ...prev[category], skills: newSkills },
                                    }))
                                  }}
                                  className="h-10"
                                  placeholder="Nome da habilidade"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeSkillFromCategory(category, skillIndex)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              onClick={() => addSkillToCategory(category, "Nova habilidade")}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Adicionar Habilidade
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Button className="w-full h-12 btn-primary" onClick={handleSavePortfolioData} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Salvar Habilidades
                    </Button>
                  </TabsContent>

                  <TabsContent value="cases" className="space-y-8 mt-0">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold mb-2" style={{ color: "#1F4E79" }}>
                          Cases & Projetos
                        </h2>
                        <p className="font-inter" style={{ color: "#5A7184" }}>
                          Edite seus projetos e cases de sucesso
                        </p>
                      </div>
                      <Button onClick={addCase} className="btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {cases.map((caseItem, caseIndex) => (
                        <Card key={caseIndex} className="p-6">
                          <div className="flex items-start justify-between mb-6">
                            <h3 className="text-lg font-semibold" style={{ color: "#1F4E79" }}>
                              Projeto {caseIndex + 1}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCase(caseIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                Título
                              </Label>
                              <Input
                                value={caseItem.title}
                                onChange={(e) => updateCase(caseIndex, "title", e.target.value)}
                                className="h-12"
                                placeholder="Nome do projeto"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                Descrição
                              </Label>
                              <Textarea
                                value={caseItem.description}
                                onChange={(e) => updateCase(caseIndex, "description", e.target.value)}
                                rows={4}
                                className="resize-none"
                                placeholder="Descrição do projeto e resultados..."
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                Link
                              </Label>
                              <Input
                                value={caseItem.link}
                                onChange={(e) => updateCase(caseIndex, "link", e.target.value)}
                                className="h-12"
                                placeholder="https://..."
                              />
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                  Tags
                                </Label>
                                <Button variant="outline" size="sm" onClick={() => addCaseTag(caseIndex)}>
                                  <Plus className="w-4 h-4 mr-1" />
                                  Adicionar
                                </Button>
                              </div>
                              {caseItem.tags.map((tag, tagIndex) => (
                                <div key={tagIndex} className="flex gap-2">
                                  <Input
                                    value={tag}
                                    onChange={(e) => updateCaseTag(caseIndex, tagIndex, e.target.value)}
                                    className="h-10"
                                    placeholder="Nome da tag"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeCaseTag(caseIndex, tagIndex)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Button className="w-full h-12 btn-primary" onClick={handleSavePortfolioData} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Salvar Projetos
                    </Button>
                  </TabsContent>

                  <TabsContent value="education" className="space-y-8 mt-0">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold mb-2" style={{ color: "#1F4E79" }}>
                          Formação Acadêmica
                        </h2>
                        <p className="font-inter" style={{ color: "#5A7184" }}>
                          Edite sua formação acadêmica
                        </p>
                      </div>
                      <Button onClick={addEducation} className="btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {education.map((edu, eduIndex) => (
                        <Card key={eduIndex} className="p-6">
                          <div className="flex items-start justify-between mb-6">
                            <h3 className="text-lg font-semibold" style={{ color: "#1F4E79" }}>
                              Formação {eduIndex + 1}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeEducation(eduIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                Curso/Graduação
                              </Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) => updateEducation(eduIndex, "degree", e.target.value)}
                                className="h-12"
                                placeholder="Nome do curso"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                Instituição
                              </Label>
                              <Input
                                value={edu.institution}
                                onChange={(e) => updateEducation(eduIndex, "institution", e.target.value)}
                                className="h-12"
                                placeholder="Nome da instituição"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                Período
                              </Label>
                              <Input
                                value={edu.period}
                                onChange={(e) => updateEducation(eduIndex, "period", e.target.value)}
                                className="h-12"
                                placeholder="Ex: 2020 - 2024"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Button className="w-full h-12 btn-primary" onClick={handleSavePortfolioData} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Salvar Formação
                    </Button>
                  </TabsContent>

                  <TabsContent value="certifications" className="space-y-8 mt-0">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold mb-2" style={{ color: "#1F4E79" }}>
                          Certificações
                        </h2>
                        <p className="font-inter" style={{ color: "#5A7184" }}>
                          Edite suas certificações e adicione links
                        </p>
                      </div>
                      <Button onClick={addCertification} className="btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {certifications.map((cert, certIndex) => (
                        <Card key={certIndex} className="p-6">
                          <div className="flex items-start justify-between mb-6">
                            <h3 className="text-lg font-semibold" style={{ color: "#1F4E79" }}>
                              Certificação {certIndex + 1}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCertification(certIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                Título da Certificação
                              </Label>
                              <Input
                                value={cert.title}
                                onChange={(e) => updateCertification(certIndex, "title", e.target.value)}
                                className="h-12"
                                placeholder="Nome da certificação"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                                Link da Certificação
                              </Label>
                              <Input
                                value={cert.link}
                                onChange={(e) => updateCertification(certIndex, "link", e.target.value)}
                                className="h-12"
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Button className="w-full h-12 btn-primary" onClick={handleSavePortfolioData} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Salvar Certificações
                    </Button>
                  </TabsContent>

                  <TabsContent value="links" className="space-y-8 mt-0">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2" style={{ color: "#1F4E79" }}>
                        Links & Rodapé
                      </h2>
                      <p className="font-inter" style={{ color: "#5A7184" }}>
                        Edite os links do rodapé e redes sociais
                      </p>
                    </div>

                    <div className="space-y-6">
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4" style={{ color: "#1F4E79" }}>
                          Links do Rodapé
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                              LinkedIn
                            </Label>
                            <Input
                              value={profileData.linkedin}
                              onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                              className="h-12"
                              placeholder="linkedin.com/in/seuperfil"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                              Email de Contato
                            </Label>
                            <Input
                              value={profileData.contactEmail}
                              onChange={(e) => setProfileData({ ...profileData, contactEmail: e.target.value })}
                              className="h-12"
                              placeholder="seu.email@exemplo.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                              Telefone
                            </Label>
                            <Input
                              value={profileData.phone}
                              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                              className="h-12"
                              placeholder="+55 (11) 99999-9999"
                            />
                          </div>
                        </div>
                      </Card>
                    </div>

                    <Button className="w-full h-12 btn-primary" onClick={handleSavePortfolioData} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Salvar Links
                    </Button>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-8 mt-0">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2" style={{ color: "#1F4E79" }}>
                        Personalização de Cores
                      </h2>
                      <p className="font-inter" style={{ color: "#5A7184" }}>
                        Personalize as cores do seu portfólio
                      </p>
                    </div>

                    {/* Color Presets */}
                    <div>
                      <h4 className="text-lg font-medium mb-4">Temas Predefinidos</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {colorPresets.map((preset, index) => (
                          <Card
                            key={index}
                            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setColors(preset)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex gap-1">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.primary }}></div>
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.secondary }}></div>
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.accent }}></div>
                              </div>
                              <span className="font-medium">{preset.name}</span>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Custom Colors */}
                    <div>
                      <h4 className="text-lg font-medium mb-4">Cores Personalizadas</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Cor Primária</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={colors.primary}
                              onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={colors.primary}
                              onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                              placeholder="#1F4E79"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Cor Secundária</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={colors.secondary}
                              onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={colors.secondary}
                              onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                              placeholder="#A8D5BA"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Cor de Destaque</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={colors.accent}
                              onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={colors.accent}
                              onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                              placeholder="#F4C430"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Cor de Fundo</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={colors.background}
                              onChange={(e) => setColors({ ...colors, background: e.target.value })}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={colors.background}
                              onChange={(e) => setColors({ ...colors, background: e.target.value })}
                              placeholder="#F8FAFC"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full h-12 btn-primary" onClick={handleSavePortfolioData} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Salvar Cores
                    </Button>
                  </TabsContent>
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
