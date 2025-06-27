"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { saveCVVersion, loadCVVersions, type ColorScheme } from "@/lib/storage-service"
import {
  Save,
  X,
  Palette,
  FileText,
  Plus,
  Copy,
  Download,
  User,
  Contact,
  BarChart3,
  Briefcase,
  Award,
  FolderOpen,
  Globe,
} from "lucide-react"

interface AdvancedEditorProps {
  initialData: any
  onClose: () => void
  onSave: (data: any) => void
}

export default function AdvancedEditor({ initialData, onClose, onSave }: AdvancedEditorProps) {
  // Initialize with safe defaults
  const [profileData, setProfileData] = useState(
    initialData?.profileData || {
      name: "",
      title: "",
      summary: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      cvUrl: "",
      contactEmail: "",
    },
  )

  const [stats, setStats] = useState(initialData?.stats || [])
  const [experiences, setExperiences] = useState(initialData?.experiences || [])
  const [skillCategories, setSkillCategories] = useState(initialData?.skillCategories || {})
  const [cases, setCases] = useState(initialData?.cases || [])
  const [certifications, setCertifications] = useState(initialData?.certifications || [])

  const [cvVersions, setCvVersions] = useState([])
  const [colors, setColors] = useState<ColorScheme>({
    primary: "#1F4E79",
    secondary: "#A8D5BA",
    accent: "#F4C430",
    background: "#F8FAFC",
  })
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Load existing versions on mount
  useEffect(() => {
    const loadVersions = async () => {
      const versions = await loadCVVersions()
      setCvVersions(versions)
    }
    loadVersions()
  }, [])

  const colorPresets = [
    { name: "Azul Profissional", primary: "#1F4E79", secondary: "#A8D5BA", accent: "#F4C430", background: "#F8FAFC" },
    { name: "Verde Moderno", primary: "#059669", secondary: "#A7F3D0", accent: "#FCD34D", background: "#F0FDF4" },
    { name: "Roxo Criativo", primary: "#7C3AED", secondary: "#C4B5FD", accent: "#F59E0B", background: "#FAF5FF" },
    { name: "Vermelho Dinâmico", primary: "#DC2626", secondary: "#FCA5A5", accent: "#FBBF24", background: "#FEF2F2" },
    { name: "Cinza Elegante", primary: "#374151", secondary: "#D1D5DB", accent: "#10B981", background: "#F9FAFB" },
  ]

  // Functions to update experiences
  const updateExperience = (index: number, field: string, value: string) => {
    const newExperiences = [...experiences]
    if (newExperiences[index]) {
      newExperiences[index] = { ...newExperiences[index], [field]: value }
      setExperiences(newExperiences)
    }
  }

  const updateExperienceAchievement = (expIndex: number, achievementIndex: number, value: string) => {
    const newExperiences = [...experiences]
    if (newExperiences[expIndex] && newExperiences[expIndex].achievements) {
      const newAchievements = [...newExperiences[expIndex].achievements]
      newAchievements[achievementIndex] = value
      newExperiences[expIndex] = { ...newExperiences[expIndex], achievements: newAchievements }
      setExperiences(newExperiences)
    }
  }

  const addExperienceAchievement = (expIndex: number) => {
    const newExperiences = [...experiences]
    if (newExperiences[expIndex]) {
      if (!newExperiences[expIndex].achievements) {
        newExperiences[expIndex].achievements = []
      }
      newExperiences[expIndex].achievements.push("Nova realização")
      setExperiences(newExperiences)
    }
  }

  const removeExperienceAchievement = (expIndex: number, achievementIndex: number) => {
    const newExperiences = [...experiences]
    if (newExperiences[expIndex] && newExperiences[expIndex].achievements) {
      newExperiences[expIndex].achievements.splice(achievementIndex, 1)
      setExperiences(newExperiences)
    }
  }

  const updateExperienceMetric = (expIndex: number, metricIndex: number, field: string, value: string) => {
    const newExperiences = [...experiences]
    if (newExperiences[expIndex] && newExperiences[expIndex].metrics) {
      const newMetrics = [...newExperiences[expIndex].metrics]
      if (newMetrics[metricIndex]) {
        newMetrics[metricIndex] = { ...newMetrics[metricIndex], [field]: value }
        newExperiences[expIndex] = { ...newExperiences[expIndex], metrics: newMetrics }
        setExperiences(newExperiences)
      }
    }
  }

  const addExperienceMetric = (expIndex: number) => {
    const newExperiences = [...experiences]
    if (newExperiences[expIndex]) {
      if (!newExperiences[expIndex].metrics) {
        newExperiences[expIndex].metrics = []
      }
      newExperiences[expIndex].metrics.push({ key: "new", value: "Nova métrica" })
      setExperiences(newExperiences)
    }
  }

  const removeExperienceMetric = (expIndex: number, metricIndex: number) => {
    const newExperiences = [...experiences]
    if (newExperiences[expIndex] && newExperiences[expIndex].metrics) {
      newExperiences[expIndex].metrics.splice(metricIndex, 1)
      setExperiences(newExperiences)
    }
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
    if (newStats[index]) {
      newStats[index] = { ...newStats[index], [field]: value }
      setStats(newStats)
    }
  }

  // Functions for skills
  const addSkillToCategory = (category: string, skill: string) => {
    if (skill.trim() && skillCategories[category]) {
      setSkillCategories((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          skills: [...(prev[category].skills || []), skill.trim()],
        },
      }))
    }
  }

  const removeSkillFromCategory = (category: string, skillIndex: number) => {
    if (skillCategories[category] && skillCategories[category].skills) {
      setSkillCategories((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          skills: prev[category].skills.filter((_, index) => index !== skillIndex),
        },
      }))
    }
  }

  // Functions for cases
  const updateCase = (index: number, field: string, value: string) => {
    const newCases = [...cases]
    if (newCases[index]) {
      newCases[index] = { ...newCases[index], [field]: value }
      setCases(newCases)
    }
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
    if (newCases[caseIndex] && newCases[caseIndex].tags) {
      const newTags = [...newCases[caseIndex].tags]
      newTags[tagIndex] = value
      newCases[caseIndex] = { ...newCases[caseIndex], tags: newTags }
      setCases(newCases)
    }
  }

  const addCaseTag = (caseIndex: number) => {
    const newCases = [...cases]
    if (newCases[caseIndex]) {
      if (!newCases[caseIndex].tags) {
        newCases[caseIndex].tags = []
      }
      newCases[caseIndex].tags.push("Nova tag")
      setCases(newCases)
    }
  }

  const removeCaseTag = (caseIndex: number, tagIndex: number) => {
    const newCases = [...cases]
    if (newCases[caseIndex] && newCases[caseIndex].tags) {
      newCases[caseIndex].tags.splice(tagIndex, 1)
      setCases(newCases)
    }
  }

  // Functions for certifications
  const updateCertification = (index: number, field: string, value: string) => {
    const newCertifications = [...certifications]
    if (newCertifications[index]) {
      newCertifications[index] = { ...newCertifications[index], [field]: value }
      setCertifications(newCertifications)
    }
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

  const saveAsNewVersion = async () => {
    try {
      setIsSaving(true)

      // Sempre pedir nome da versão e UTM
      const versionName = prompt("Nome da nova versão:")
      if (!versionName) return

      const utm = prompt("Digite o UTM para esta versão (ex: ifood, google, linkedin):")
      if (!utm) return

      // Verificar se UTM já existe
      const existingVersion = cvVersions.find((v: any) => v.utm === utm && v.is_active)
      if (existingVersion) {
        toast({
          title: "UTM já existe",
          description: "Este UTM já está sendo usado por outra versão ativa.",
          variant: "destructive",
        })
        return
      }

      const newVersion = {
        id: Date.now().toString(),
        name: versionName,
        utm: utm,
        is_active: true,
        data: {
          profile_data: { ...profileData },
          stats: [...stats],
          experiences: [...experiences],
          skill_categories: { ...skillCategories },
          cases: [...cases],
          certifications: [...certifications],
          colors: { ...colors },
        },
      }

      const success = await saveCVVersion(newVersion)

      if (success) {
        // Recarregar versões
        const updatedVersions = await loadCVVersions()
        setCvVersions(updatedVersions)

        toast({
          title: "Nova versão criada!",
          description: `Versão "${versionName}" foi criada com UTM: ${utm}`,
        })

        // Mostrar URL da nova versão
        const currentUrl = typeof window !== "undefined" ? window.location.origin : ""
        toast({
          title: "URL da versão",
          description: `${currentUrl}?utm=${utm}`,
        })
      } else {
        throw new Error("Falha ao salvar versão")
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a nova versão.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const duplicateVersion = (versionId: string) => {
    const version = cvVersions.find((v: any) => v.id === versionId)
    if (version) {
      const newName = prompt("Nome da versão duplicada:", `${version.name} - Cópia`)
      if (newName) {
        const utm = prompt("Digite o UTM para a nova versão:")
        if (utm) {
          const newVersion = {
            id: Date.now().toString(),
            name: newName,
            utm: utm,
            is_active: true,
            data: { ...version.data },
          }
          saveCVVersion(newVersion).then(() => {
            loadCVVersions().then(setCvVersions)
            toast({
              title: "Versão duplicada!",
              description: `Versão "${newName}" foi criada com sucesso.`,
            })
          })
        }
      }
    }
  }

  const generatePDF = (versionId: string) => {
    const version = cvVersions.find((v: any) => v.id === versionId)
    if (version) {
      // Abrir nova janela com a versão específica para impressão
      const currentUrl = typeof window !== "undefined" ? window.location.origin : ""
      const printUrl = `${currentUrl}?utm=${version.utm}&print=true`

      const printWindow = window.open(printUrl, "_blank")
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print()
          }, 1000)
        }
      }

      toast({
        title: "Abrindo para impressão",
        description: `CV da versão "${version.name}" foi aberto para impressão/PDF.`,
      })
    }
  }

  const exportVersion = (versionId: string) => {
    const version = cvVersions.find((v: any) => v.id === versionId)
    if (version) {
      const dataStr = JSON.stringify(version, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `cv-${version.name.toLowerCase().replace(/\s+/g, "-")}.json`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-[95%] h-[95%] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editor Avançado</h2>
            <p className="text-gray-600">Crie novas versões do currículo com UTM personalizado</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          <Tabs defaultValue="versions" orientation="vertical" className="w-full flex">
            {/* Sidebar */}
            <div className="w-80 border-r bg-gray-50 flex flex-col">
              <div className="p-6">
                <TabsList className="grid w-full grid-cols-1 gap-2 h-auto bg-transparent">
                  <TabsTrigger value="versions" className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Versões do CV
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="justify-start">
                    <Contact className="w-4 h-4 mr-2" />
                    Contato
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Estatísticas
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="justify-start">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Experiência
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="justify-start">
                    <Award className="w-4 h-4 mr-2" />
                    Habilidades
                  </TabsTrigger>
                  <TabsTrigger value="cases" className="justify-start">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Cases
                  </TabsTrigger>
                  <TabsTrigger value="certifications" className="justify-start">
                    <Globe className="w-4 h-4 mr-2" />
                    Certificações
                  </TabsTrigger>
                  <TabsTrigger value="colors" className="justify-start">
                    <Palette className="w-4 h-4 mr-2" />
                    Cores & Tema
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <ScrollArea className="h-full">
                <div className="p-8">
                  <TabsContent value="versions" className="mt-0">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Versões do Currículo</h3>
                        <Button
                          onClick={saveAsNewVersion}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={isSaving}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {isSaving ? "Salvando..." : "Salvar Nova Versão"}
                        </Button>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Como funciona:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Cada versão é salva com um UTM único</li>
                          <li>• Use UTMs como: linkedin, ifood, google, etc.</li>
                          <li>• A URL será: seusite.com?utm=linkedin</li>
                          <li>• Cada versão pode ter conteúdo diferente</li>
                        </ul>
                      </div>

                      <div className="grid gap-4">
                        {cvVersions &&
                          cvVersions.length > 0 &&
                          cvVersions.map((version: any) => (
                            <Card key={version.id} className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{version.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    Criado em: {new Date(version.created_at).toLocaleDateString()}
                                  </p>
                                  {version.utm && (
                                    <p className="text-xs text-blue-600 mt-1">
                                      UTM: {version.utm} | URL:{" "}
                                      {typeof window !== "undefined" ? window.location.origin : ""}?utm={version.utm}
                                    </p>
                                  )}
                                  <Badge variant={version.is_active ? "default" : "secondary"} className="mt-2">
                                    {version.is_active ? "Ativa" : "Inativa"}
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={() => duplicateVersion(version.id)}>
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => generatePDF(version.id)}>
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => exportVersion(version.id)}>
                                    <FileText className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Todas as outras abas permanecem iguais ao editor básico */}
                  <TabsContent value="profile" className="space-y-8 mt-0">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Informações Pessoais</h2>
                      <p className="text-gray-600">Edite suas informações básicas do perfil</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          value={profileData.name || ""}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="h-12"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Título Profissional</Label>
                        <Input
                          id="title"
                          value={profileData.title || ""}
                          onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                          className="h-12"
                          placeholder="Seu cargo ou área de atuação"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="summary">Resumo Profissional</Label>
                      <Textarea
                        id="summary"
                        value={profileData.summary || ""}
                        onChange={(e) => setProfileData({ ...profileData, summary: e.target.value })}
                        rows={6}
                        className="resize-none"
                        placeholder="Descreva sua experiência e objetivos profissionais..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-8 mt-0">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Personalização de Cores</h3>

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
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">Editando dados para nova versão do currículo</div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={saveAsNewVersion} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
              {isSaving ? <Save className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar Nova Versão
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
