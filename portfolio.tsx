"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { loadPortfolioData, savePortfolioData } from "./lib/storage-service"
import { isSupabaseConfigured } from "./lib/supabase"
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Download,
  BarChart3,
  Award,
  Save,
  Star,
  TrendingUp,
  Users,
  Target,
  Database,
  Zap,
  Users2,
  X,
  FolderOpen,
  User,
  Contact,
  Briefcase,
  Loader2,
  AlertTriangle,
  ExternalLink,
  FileText,
  Globe,
  Plus,
  Trash2,
  Menu,
  Home,
} from "lucide-react"

export default function Portfolio() {
  const [isEditing, setIsEditing] = useState(false)
  const [showEditButton, setShowEditButton] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const [profileData, setProfileData] = useState({
    name: "Felipe Moura",
    title: "Business Analyst | Estratégia & Eficiência Operacional",
    summary:
      "Analista de Negócios com experiência em liderar projetos estratégicos com foco em eficiência, escalabilidade e resultados orientados por dados. Atuo na interseção entre operações, tecnologia e produto, ajudando empresas a transformar métricas em ações concretas.",
    email: "felipegoncalvesmoura@gmail.com",
    phone: "+55 (77) 98119-8898",
    location: "Vitória da Conquista, Bahia",
    linkedin: "linkedin.com/in/felipegmoura",
    cvUrl: "",
    contactEmail: "felipegoncalvesmoura@gmail.com",
  })

  const [stats, setStats] = useState([
    { label: "Projetos Liderados", value: "15+", icon: Target },
    { label: "Equipes Gerenciadas", value: "20+", icon: Users },
    { label: "Eficiência Média", value: "35%", icon: TrendingUp },
    { label: "Anos Experiência", value: "4+", icon: Star },
  ])

  const [experiences, setExperiences] = useState([
    {
      title: "Analista de Negócios Sênior | Produtos Recorrentes",
      company: "Woba",
      period: "abril de 2025 - Present",
      description:
        "Atuação estratégica e operacional como ponto de convergência entre operações, negócios e tecnologia, com forte enfoque na identificação e execução de oportunidades de melhorias.",
      achievements: [
        "Liderança de projetos críticos com um produto principal, gerenciando uma equipe de dois analistas",
        "Análise de dados e criação de soluções de automação (low/no-code) para otimizar processos",
        "Implementação de estratégias para otimização de processos, com aplicação da metodologia RACI",
      ],
      metrics: [
        { key: "team", value: "2 analistas" },
        { key: "impact", value: "30% redução tempo" },
      ],
    },
    {
      title: "Analista de Negócios Pleno | Produtos sob Demanda",
      company: "Woba",
      period: "outubro de 2024 - abril de 2025",
      description:
        "Liderança de projetos em área com 2 produtos e 7 analistas, acompanhando métricas de volume, eficiência e qualidade.",
      achievements: [
        "Lançamento de nova Pipeline com redução de 30% no tempo do fechamento dos tickets",
        "Diminuição da quantidade de SLA's vencidos",
        "Calculadora no-code que gera conversão 70% maior nos ativos cadastrados",
      ],
      metrics: [
        { key: "team", value: "7 analistas" },
        { key: "impact", value: "70% conversão" },
      ],
    },
    {
      title: "CS Coordenador de Suporte",
      company: "Frexco",
      period: "fevereiro de 2022 - março de 2022",
      description:
        "Acompanhamento e análise de KPI's (Tempo de espera, CSAT, NPs, Churn, etc.) para uma equipe de 8 atendentes, com foco em gestão de pessoas e processos.",
      achievements: [
        "Gestão de equipe de 8 atendentes com foco em desenvolvimento pessoal",
        "Criação e execução de processos (playbooks, atualização de plataformas)",
        "Apoio a setores como IT e logística",
      ],
      metrics: [
        { key: "team", value: "8 atendentes" },
        { key: "focus", value: "Gestão pessoas" },
      ],
    },
  ])

  const [skillCategories, setSkillCategories] = useState({
    "Análise de Dados": {
      icon: Database,
      skills: ["SQL", "Power BI", "Looker", "Google Sheets", "Análise de Dados", "Processos Data-Driven"],
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    "CRM & Gestão": {
      icon: Users2,
      skills: ["HubSpot", "Pipefy", "Descoberta de produtos", "Análise de requisitos", "Liderança de Projetos"],
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    "Automação & Processos": {
      icon: Zap,
      skills: ["Zapier", "Make", "n8n", "BPMN", "Melhoria Contínua"],
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
    },
  })

  const [cases, setCases] = useState([
    {
      title: "Otimização de Pipeline de Vendas",
      description: "Implementação de automação que reduziu 30% do tempo de fechamento de tickets",
      link: "https://notion.so/exemplo1",
      tags: ["Automação", "Vendas", "Eficiência"],
    },
    {
      title: "Dashboard de Métricas Operacionais",
      description: "Criação de dashboard estratégico para monitoramento de produtividade",
      link: "https://notion.so/exemplo2",
      tags: ["Analytics", "Dashboard", "KPIs"],
    },
  ])

  // Navigation items
  const navigationItems = [
    { id: "home", label: "Início", icon: Home },
    { id: "stats", label: "Highlights", icon: BarChart3 },
    { id: "contact", label: "Contato", icon: Contact },
    { id: "experience", label: "Experiência", icon: Briefcase },
    { id: "skills", label: "Habilidades", icon: Award },
    { id: "cases", label: "Projetos", icon: FolderOpen },
    { id: "certifications", label: "Certificações", icon: FileText },
  ]

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setShowMobileMenu(false)
    }
  }

  // Load data from storage service
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await loadPortfolioData()

        if (data) {
          // Se temos dados do storage, atualizamos o estado
          if (data.profile_data) setProfileData(data.profile_data)

          if (data.stats) {
            setStats(
              data.stats.map((stat: any) => ({
                ...stat,
                icon: getIconComponent(stat.icon),
              })),
            )
          }

          if (data.experiences) setExperiences(data.experiences)

          if (data.skill_categories) {
            // Convert skill categories with icon components
            const skillCategoriesWithIcons = Object.entries(data.skill_categories).reduce(
              (acc, [key, value]: [string, any]) => {
                acc[key] = {
                  ...value,
                  icon: getIconComponent(value.icon),
                }
                return acc
              },
              {} as any,
            )
            setSkillCategories(skillCategoriesWithIcons)
          }

          if (data.cases) setCases(data.cases)
        }

        // Mostrar aviso se o Supabase não estiver configurado
        if (!isSupabaseConfigured) {
          toast({
            title: "Modo local ativado",
            description: "Suas alterações serão salvas apenas neste navegador.",
            variant: "warning",
          })
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro ao carregar dados",
          description: "Usando dados padrão. Suas alterações serão salvas localmente neste navegador.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Target,
      Users,
      TrendingUp,
      Star,
      Database,
      Users2,
      Zap,
    }
    return icons[iconName] || Target
  }

  const handleSavePortfolioData = async () => {
    try {
      setIsSaving(true)

      // Convert skill categories to save format
      const skillCategoriesForSave = Object.entries(skillCategories).reduce((acc, [key, value]: [string, any]) => {
        acc[key] = {
          ...value,
          icon: value.icon.name || "Database", // Save icon name instead of component
        }
        return acc
      }, {} as any)

      // Convert stats to save format
      const statsForSave = stats.map((stat) => ({
        ...stat,
        icon: stat.icon.name || "Target",
      }))

      const dataToSave = {
        profile_data: profileData,
        stats: statsForSave,
        experiences,
        skill_categories: skillCategoriesForSave,
        cases,
      }

      const success = await savePortfolioData(dataToSave)

      if (success) {
        toast({
          title: "Dados salvos!",
          description: isSupabaseConfigured
            ? "Suas informações foram salvas com sucesso."
            : "Suas informações foram salvas localmente neste navegador.",
        })
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
    }
  }

  const handlePasswordSubmit = () => {
    if (passwordInput === "21081898") {
      setShowPasswordModal(false)
      setShowEditButton(true)
      setPasswordInput("")
      setPasswordError("")
    } else {
      setPasswordError("Senha incorreta")
      setPasswordInput("")
    }
  }

  const handlePhotoClick = () => {
    setClickCount((prev) => prev + 1)

    if (clickCount === 0) {
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0)
      }, 5000)
    }

    if (clickCount + 1 === 3) {
      setShowPasswordModal(true)
      setClickCount(0)
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

  const certifications = [
    "Lei Geral de Proteção de Dados (LGPD)",
    "SQL: a linguagem dos bancos de dados",
    "Pocket Agil - Agilidade de forma simples e fácil de entender",
    "Tecnologia para Product Managers",
    "Métricas de Negócios Digitais",
  ]

  const languages = [
    { name: "Português", level: "Nativo" },
    { name: "Inglês", level: "Intermediário" },
    { name: "Espanhol", level: "Intermediário" },
  ]

  // Funções de atualização
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

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setStats(newStats)
  }

  // Funções para habilidades
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

  // Funções para cases
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

  const handleSave = async (section: string) => {
    await handleSavePortfolioData()
    setShowEditButton(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <span className="text-lg text-gray-600">Carregando portfólio...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#F4F6F8" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        .hover-lift {
          transition: all 0.2s ease-in-out;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(31, 78, 121, 0.15);
        }
        
        .btn-primary {
          background-color: #F4C430;
          color: #1F4E79;
          transition: all 0.2s ease-in-out;
        }
        
        .btn-primary:hover {
          filter: brightness(0.95);
          box-shadow: 0 4px 12px rgba(244, 196, 48, 0.3);
        }
        
        .btn-secondary {
          border-color: #A8D5BA;
          color: #1F4E79;
          transition: all 0.2s ease-in-out;
        }
        
        .btn-secondary:hover {
          background-color: #A8D5BA;
          color: #1F4E79;
          box-shadow: 0 4px 12px rgba(158, 197, 171, 0.2);
        }

        .skill-card-1 {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .skill-card-2 {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        .skill-card-3 {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#1F4E79" }}
              >
                <span className="text-white font-bold text-sm">FM</span>
              </div>
              <span className="font-semibold" style={{ color: "#1F4E79" }}>
                Felipe Moura
              </span>
            </div>

            {/* Desktop Navigation - CENTRALIZADO */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100"
                    style={{ color: "#5A7184" }}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Espaço vazio para manter o logo alinhado à esquerda */}
            <div className="w-[100px] hidden md:block"></div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100"
                    style={{ color: "#5A7184" }}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Password Modal com melhor design */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Acesso ao Editor</h2>
            <p className="text-slate-600 mb-6 font-inter">Digite a senha para acessar o modo de edição:</p>
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Digite a senha"
              className="mb-4 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
            />
            {passwordError && <p className="text-red-600 text-sm mb-4 font-medium">{passwordError}</p>}
            <div className="flex gap-3">
              <Button
                onClick={handlePasswordSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 font-medium"
              >
                Entrar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordModal(false)
                  setPasswordInput("")
                  setPasswordError("")
                }}
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 h-12"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Storage Mode Indicator */}
      {!isSupabaseConfigured && (
        <div className="fixed bottom-4 right-4 z-50 bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm font-medium">Modo Local</span>
        </div>
      )}

      {/* Floating Edit Button */}
      {showEditButton && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-[95%] h-[95%] rounded-xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div
              className="px-8 py-6 border-b flex items-center justify-between"
              style={{ backgroundColor: "#A8D5BA" }}
            >
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#1F4E79" }}>
                  Editar Portfólio
                </h2>
                <p className="mt-1 font-inter" style={{ color: "#5A7184" }}>
                  Faça alterações nas suas informações profissionais
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowEditButton(false)} className="h-10 w-10">
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
                        Highlights
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
                            <Label
                              htmlFor="name"
                              className="text-sm font-medium font-inter"
                              style={{ color: "#5A7184" }}
                            >
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
                            <Label
                              htmlFor="title"
                              className="text-sm font-medium font-inter"
                              style={{ color: "#5A7184" }}
                            >
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
                            <Label
                              htmlFor="cvUrl"
                              className="text-sm font-medium font-inter"
                              style={{ color: "#5A7184" }}
                            >
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
                          <Label
                            htmlFor="summary"
                            className="text-sm font-medium font-inter"
                            style={{ color: "#5A7184" }}
                          >
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

                        <Button
                          className="w-full h-12 btn-primary"
                          onClick={() => handleSave("profile")}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
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
                            <Label
                              htmlFor="email"
                              className="text-sm font-medium font-inter"
                              style={{ color: "#5A7184" }}
                            >
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
                            <Label
                              htmlFor="phone"
                              className="text-sm font-medium font-inter"
                              style={{ color: "#5A7184" }}
                            >
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

                        <Button
                          className="w-full h-12 btn-primary"
                          onClick={() => handleSave("contact")}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Salvar Informações de Contato
                        </Button>
                      </TabsContent>

                      <TabsContent value="stats" className="space-y-8 mt-0">
                        <div className="mb-6">
                          <h2 className="text-xl font-semibold mb-2" style={{ color: "#1F4E79" }}>
                            Highlights
                          </h2>
                          <p className="font-inter" style={{ color: "#5A7184" }}>
                            Edite seus highlights profissionais
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

                        <Button
                          className="w-full h-12 btn-primary"
                          onClick={() => handleSave("stats")}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Salvar Highlights
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
                          {/* Substituir a estrutura atual das experiências (aproximadamente linha 515-570) por: */}
                          <div className="space-y-0">
                            {experiences.map((exp, index) => (
                              <div key={index}>
                                <div className="py-8">
                                  {/* Badges das métricas ACIMA do título */}
                                  <div className="flex gap-3 mb-4">
                                    {exp.metrics.map((metric, metricIndex) => (
                                      <Badge
                                        key={metricIndex}
                                        className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300 border-0 rounded-2xl px-4 py-2 font-medium smooth-hover"
                                      >
                                        {metric.value}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                      <h3 className="text-xl font-bold text-gray-900 mb-2">{exp.title}</h3>
                                      <p className="text-gray-700 font-semibold mb-4">{exp.company}</p>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className="text-sm text-gray-600 border-gray-200 ml-4 rounded-2xl px-4 py-2"
                                    >
                                      {exp.period}
                                    </Badge>
                                  </div>

                                  <p className="text-gray-600 mb-6 leading-relaxed">{exp.description}</p>

                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">Principais realizações:</h4>
                                    <ul className="space-y-3">
                                      {exp.achievements.map((achievement, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mt-2 flex-shrink-0 shadow-sm"></div>
                                          <span className="text-gray-600 leading-relaxed">{achievement}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                {/* Gradient separator line between experiences */}
                                {index < experiences.length - 1 && (
                                  <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          className="w-full h-12 btn-primary"
                          onClick={() => handleSave("experience")}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
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
                          {/* Aplicar gradiente nos cards de habilidades da cor primária para branco - alterar a seção de skills (aproximadamente linha 610-640): */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {Object.entries(skillCategories).map(([category, data], index) => (
                              <div
                                key={category}
                                className="rounded-3xl overflow-hidden border border-white/50 shadow-lg smooth-hover"
                              >
                                <div className="p-6 bg-gradient-to-br from-blue-600 via-blue-500 to-white text-white">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                      <data.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{category}</h3>
                                  </div>
                                </div>
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
                                  <div className="flex flex-wrap gap-2">
                                    {data.skills.map((skill, skillIndex) => (
                                      <Badge
                                        key={skillIndex}
                                        className="bg-white/80 text-blue-800 hover:bg-white border border-blue-200 py-2 px-3 rounded-2xl font-medium smooth-hover shadow-sm"
                                      >
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          className="w-full h-12 btn-primary"
                          onClick={() => handleSave("skills")}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
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

                        <Button
                          className="w-full h-12 btn-primary"
                          onClick={() => handleSave("cases")}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Salvar Projetos
                        </Button>
                      </TabsContent>
                    </div>
                  </ScrollArea>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      {/* Header - Alinhamento perfeito da foto com cards */}
      <header id="home" className="relative bg-white shadow-sm border-b border-slate-200 overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-emerald-50/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            {/* Foto */}
            <div className="relative flex-shrink-0">
              <div
                className="w-48 h-48 cursor-pointer hover:scale-105 transition-transform duration-200 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white"
                onClick={handlePhotoClick}
              >
                <img src="/images/felipe-photo.png" alt="Felipe Moura" className="w-full h-full object-cover" />
              </div>
              <div
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white shadow-lg"
                style={{ backgroundColor: "#1F4E79" }}
              ></div>
            </div>

            {/* Texto */}
            <div className="text-left flex-1 max-w-3xl">
              <h1
                className="text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight"
                style={{ color: "#1F4E79" }}
              >
                {profileData.name}
              </h1>
              <p className="text-xl mb-6 font-medium leading-relaxed font-inter" style={{ color: "#5A7184" }}>
                {profileData.title}
              </p>
              <p className="text-base mb-8 leading-relaxed max-w-2xl font-inter" style={{ color: "#5A7184" }}>
                {profileData.summary}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  className="gap-2 text-white shadow-lg h-12 px-8 text-sm font-medium rounded-lg btn-primary"
                  onClick={() => profileData.cvUrl && window.open(profileData.cvUrl, "_blank")}
                  disabled={!profileData.cvUrl}
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 h-12 px-8 text-sm font-medium rounded-lg btn-secondary"
                  onClick={() =>
                    profileData.contactEmail && window.open(`mailto:${profileData.contactEmail}`, "_blank")
                  }
                >
                  <Mail className="w-4 h-4" />
                  Contato
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Stats Cards - Layout em linha horizontal */}
        <section id="stats">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold inline-flex items-center gap-4" style={{ color: "#1F4E79" }}>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#A8D5BA" }}
              >
                <BarChart3 className="w-6 h-6" style={{ color: "#1F4E79" }} />
              </div>
              Highlights
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center transition-all duration-300 border border-slate-200 rounded-xl overflow-hidden group hover-lift"
                style={{ backgroundColor: "white" }}
              >
                <CardContent className="p-8">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200"
                    style={{ backgroundColor: "#A8D5BA" }}
                  >
                    <stat.icon className="w-6 h-6" style={{ color: "#1F4E79" }} />
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: "#1F4E79" }}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium font-inter" style={{ color: "#5A7184" }}>
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Info com cards maiores para o email */}
        <section id="contact">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold inline-flex items-center gap-4" style={{ color: "#1F4E79" }}>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#A8D5BA" }}
              >
                <Contact className="w-6 h-6" style={{ color: "#1F4E79" }} />
              </div>
              Contato
            </h2>
          </div>
          <Card
            className="border border-slate-200 shadow-lg rounded-xl hover-lift"
            style={{ backgroundColor: "white" }}
          >
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <a
                  href={`mailto:${profileData.email}`}
                  className="flex flex-col gap-4 p-6 rounded-xl transition-all duration-300 group cursor-pointer border hover-lift"
                  style={{ backgroundColor: "#F4F6F8", borderColor: "#A8D5BA" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
                      style={{ backgroundColor: "#1F4E79" }}
                    >
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className="text-xs font-semibold uppercase tracking-wider font-inter"
                      style={{ color: "#5A7184" }}
                    >
                      Email
                    </div>
                  </div>
                  <div className="font-semibold text-xs leading-tight break-all" style={{ color: "#1F4E79" }}>
                    {profileData.email}
                  </div>
                </a>

                <a
                  href={`tel:${profileData.phone}`}
                  className="flex flex-col gap-4 p-6 rounded-xl transition-all duration-300 group cursor-pointer border hover-lift"
                  style={{ backgroundColor: "#F4F6F8", borderColor: "#A8D5BA" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
                      style={{ backgroundColor: "#1F4E79" }}
                    >
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className="text-xs font-semibold uppercase tracking-wider font-inter"
                      style={{ color: "#5A7184" }}
                    >
                      Telefone
                    </div>
                  </div>
                  <div className="font-semibold text-sm" style={{ color: "#1F4E79" }}>
                    {profileData.phone}
                  </div>
                </a>

                <div
                  className="flex flex-col gap-4 p-6 rounded-xl transition-all duration-300 group border hover-lift"
                  style={{ backgroundColor: "#F4F6F8", borderColor: "#A8D5BA" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
                      style={{ backgroundColor: "#1F4E79" }}
                    >
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className="text-xs font-semibold uppercase tracking-wider font-inter"
                      style={{ color: "#5A7184" }}
                    >
                      Localização
                    </div>
                  </div>
                  <div className="font-semibold text-sm" style={{ color: "#1F4E79" }}>
                    {profileData.location}
                  </div>
                </div>

                <a
                  href={`https://${profileData.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-4 p-6 rounded-xl transition-all duration-300 group cursor-pointer border hover-lift"
                  style={{ backgroundColor: "#F4F6F8", borderColor: "#A8D5BA" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
                      style={{ backgroundColor: "#1F4E79" }}
                    >
                      <Linkedin className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className="text-xs font-semibold uppercase tracking-wider font-inter"
                      style={{ color: "#5A7184" }}
                    >
                      LinkedIn
                    </div>
                  </div>
                  <div className="font-semibold text-sm leading-tight break-words" style={{ color: "#1F4E79" }}>
                    {profileData.linkedin}
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Experience com borda verde suave */}
        <section id="experience">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold inline-flex items-center gap-4" style={{ color: "#1F4E79" }}>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#A8D5BA" }}
              >
                <Briefcase className="w-6 h-6" style={{ color: "#1F4E79" }} />
              </div>
              Experiência Profissional
            </h2>
          </div>
          <div className="space-y-8">
            <div className="space-y-0">
              {experiences.map((exp, index) => (
                <div key={index}>
                  <div className="py-8">
                    {/* Badges das métricas ACIMA do título */}
                    <div className="flex gap-3 mb-4">
                      {exp.metrics.map((metric, metricIndex) => (
                        <Badge
                          key={metricIndex}
                          className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300 border-0 rounded-2xl px-4 py-2 font-medium smooth-hover"
                        >
                          {metric.value}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{exp.title}</h3>
                        <p className="text-gray-700 font-semibold mb-4">{exp.company}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-sm text-gray-600 border-gray-200 ml-4 rounded-2xl px-4 py-2"
                      >
                        {exp.period}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">{exp.description}</p>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Principais realizações:</h4>
                      <ul className="space-y-3">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mt-2 flex-shrink-0 shadow-sm"></div>
                            <span className="text-gray-600 leading-relaxed">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Gradient separator line between experiences */}
                  {index < experiences.length - 1 && (
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills by Categories com cores dinâmicas */}
        <section id="skills">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold inline-flex items-center gap-4" style={{ color: "#1F4E79" }}>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#A8D5BA" }}
              >
                <Award className="w-6 h-6" style={{ color: "#1F4E79" }} />
              </div>
              Habilidades & Competências
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(skillCategories).map(([category, data], index) => (
              <div key={category} className="rounded-3xl overflow-hidden border border-white/50 shadow-lg smooth-hover">
                <div className="p-6 bg-gradient-to-br from-blue-600 via-blue-500 to-white text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <data.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">{category}</h3>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, skillIndex) => (
                      <Badge
                        key={skillIndex}
                        className="bg-white/80 text-blue-800 hover:bg-white border border-blue-200 py-2 px-3 rounded-2xl font-medium smooth-hover shadow-sm"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cases */}
        <section id="cases">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold inline-flex items-center gap-4" style={{ color: "#1F4E79" }}>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#A8D5BA" }}
              >
                <FolderOpen className="w-6 h-6" style={{ color: "#1F4E79" }} />
              </div>
              Cases & Projetos
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cases.map((caseItem, index) => (
              <Card
                key={index}
                className="border border-slate-200 shadow-lg transition-all duration-300 overflow-hidden bg-white rounded-xl hover-lift"
              >
                <CardHeader className="space-y-2 p-6" style={{ backgroundColor: "#F4F6F8" }}>
                  <CardTitle className="text-xl font-semibold" style={{ color: "#1F4E79" }}>
                    {caseItem.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed font-inter" style={{ color: "#5A7184" }}>
                    {caseItem.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {caseItem.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        className="border rounded-full px-3 py-1 font-inter"
                        style={{ backgroundColor: "#A8D5BA", color: "#1F4E79", borderColor: "#A8D5BA" }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <a
                    href={caseItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-medium transition-colors hover:underline font-inter"
                    style={{ color: "#1F4E79" }}
                  >
                    Ver projeto
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Certifications & Languages */}
        <section id="certifications">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold inline-flex items-center gap-4" style={{ color: "#1F4E79" }}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#A8D5BA" }}
                  >
                    <FileText className="w-5 h-5" style={{ color: "#1F4E79" }} />
                  </div>
                  Certificações
                </h2>
              </div>
              <Card className="border border-slate-200 shadow-lg h-full bg-white rounded-xl hover-lift">
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {certifications.map((cert, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-xl transition-colors hover:bg-slate-50"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: "#A8D5BA" }}
                        >
                          <Award className="w-3 h-3" style={{ color: "#1F4E79" }} />
                        </div>
                        <span className="font-inter" style={{ color: "#5A7184" }}>
                          {cert}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold inline-flex items-center gap-4" style={{ color: "#1F4E79" }}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#A8D5BA" }}
                  >
                    <Globe className="w-5 h-5" style={{ color: "#1F4E79" }} />
                  </div>
                  Idiomas
                </h2>
              </div>
              <Card className="border border-slate-200 shadow-lg h-full bg-white rounded-xl hover-lift">
                <CardContent className="p-6">
                  <ul className="space-y-6">
                    {languages.map((lang, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl transition-colors hover:bg-slate-50"
                      >
                        <span className="font-semibold" style={{ color: "#1F4E79" }}>
                          {lang.name}
                        </span>
                        <Badge
                          className="border rounded-full px-3 py-1 font-medium font-inter"
                          style={{ backgroundColor: "#A8D5BA", color: "#1F4E79", borderColor: "#A8D5BA" }}
                        >
                          {lang.level}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-white mt-20" style={{ backgroundColor: "#1F4E79" }}>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-slate-300 font-inter">© 2024 Felipe Moura. Todos os direitos reservados.</p>
              <p className="text-sm text-slate-400 mt-1 font-inter">Desenvolvido com Next.js e Tailwind CSS</p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-white transition-colors duration-200"
                style={{ backgroundColor: "transparent" }}
                onClick={() => profileData.linkedin && window.open(`https://${profileData.linkedin}`, "_blank")}
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-white transition-colors duration-200"
                style={{ backgroundColor: "transparent" }}
                onClick={() => profileData.contactEmail && window.open(`mailto:${profileData.contactEmail}`, "_blank")}
              >
                <Mail className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-white transition-colors duration-200"
                style={{ backgroundColor: "transparent" }}
                onClick={() => profileData.phone && window.open(`tel:${profileData.phone}`, "_blank")}
              >
                <Phone className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
