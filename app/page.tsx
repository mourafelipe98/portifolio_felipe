"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { loadPortfolioData, loadColors, loadCVVersionByUTM } from "@/lib/storage-service"
import { isSupabaseConfigured } from "@/lib/supabase"
import PortfolioEditor from "@/components/portfolio-editor"
import {
  Mail,
  Phone,
  Linkedin,
  Download,
  BarChart3,
  Award,
  Star,
  TrendingUp,
  Users,
  Target,
  Database,
  Zap,
  Users2,
  FolderOpen,
  Briefcase,
  Loader2,
  FileText,
  Globe,
  X,
  MapPin,
  ExternalLink,
} from "lucide-react"

export default function Portfolio() {
  const [isEditing, setIsEditing] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showEmailPopup, setShowEmailPopup] = useState(false)
  const [showPhonePopup, setShowPhonePopup] = useState(false)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const [profileData, setProfileData] = useState({
    name: "Felipe Moura",
    title:
      "Business Analyst | Estratégia & Eficiência Operacional",
    summary:
      "Analista de Negócios com experiência em liderar projetos estratégicos com foco em eficiência, escalabilidade e resultados orientados por dados. Atuo na interseção entre operações, tecnologia e produto, ajudando empresas a transformar métricas em ações concretas",
    email: "felipegoncalvesmoura@gmail.com",
    phone: "+55 (77) 99999-9999",
    location: "Vitória da Conquista, Bahia, Brasil",
    linkedin: "linkedin.com/in/felipegmoura",
    cvUrl: "",
    contactEmail: "felipegoncalvesmoura@gmail.com",
  })

  const [stats, setStats] = useState([
    { label: "Anos de Experiência", value: "2+", icon: Target },
    { label: "Dashboards Criados", value: "50+", icon: Users },
    { label: "Projetos de BI", value: "15+", icon: TrendingUp },
    { label: "Certificações", value: "5", icon: Star },
  ])

  const [experiences, setExperiences] = useState([
    {
      title: "Analista de Dados",
      company: "Cabral & Sousa",
      period: "novembro de 2024 - Present (8 meses)",
      description:
        "Criação e manutenção de dashboards estratégicos em Power BI e Excel, com KPIs logísticos, operacionais e de vendas, aplicando técnicas de visualização de dados e storytelling com dados.",
      achievements: [
        "Utilização de SQL para extração, transformação e carga de dados (ETL), assegurando qualidade e consistência das informações",
        "Análises preditivas e exploratórias com apoio de Microsoft Fabric (Pipelines e Notebooks), identificando padrões e oportunidades para as áreas de negócio",
        "Aplicação de DAX e Linguagem M na modelagem e enriquecimento de dados para dashboards dinâmicos",
        "Segmentação de clientes e realização de testes A/B com foco em campanhas direcionadas, utilizando conceitos de governança de dados e LGPD",
        "Participação ativa em reuniões com stakeholders, contribuindo na definição de indicadores de desempenho (KPIs) e metas orientadas por dados",
        "Higienização e padronização de dados com Power Query e apoio inicial em automações com Python e GitHub",
      ],
      metrics: [
        { key: "dashboards", value: "Power BI & Excel" },
        { key: "tools", value: "Microsoft Fabric" },
      ],
    },
    {
      title: "Informações Estratégicas Jr",
      company: "Unimed do Sudoeste",
      period: "outubro de 2023 - novembro de 2024 (1 ano 2 meses)",
      description:
        "Criação de datasets e views em SQL, com automatização de processos de ETL utilizando Knime e Pentaho. Monitoramento de indicadores ao longo do funil de relacionamento, campanhas de engajamento e fluxos de atendimento.",
      achievements: [
        "Estudo do comportamento de usuários para gerar insights sobre consumo, fidelização e performance de canais",
        "Elaboração de análises comparativas para benchmarking interno e externo, apoiando projetos de inteligência competitiva",
        "Garantia de qualidade da informação com aplicação de conceitos de LGPD e boas práticas de governança de dados",
        "Comunicação de análises e resultados por meio de data storytelling visual, facilitando a compreensão e tomada de decisões pela alta gestão",
        "Monitoramento diário de tendências e notícias de mercado, promovendo a disseminação de conhecimento estratégico dentro da empresa",
      ],
      metrics: [
        { key: "automation", value: "Knime & Pentaho" },
        { key: "insights", value: "Análises diárias" },
      ],
    },
    {
      title: "Customer Service",
      company: "R2 Centro de Treinamento",
      period: "julho de 2019 - março de 2023 (3 anos 9 meses)",
      description:
        "Atendimento multicanal (telefone, e-mail e chat) com foco em excelência e resolução de problemas de forma ágil e empática.",
      achievements: [
        "Investigação e solução de dúvidas e reclamações, atuando na linha de frente com suporte técnico básico aos clientes",
        "Coleta de feedbacks e sugestões para melhoria contínua de produtos, processos e experiência do usuário",
        "Registro detalhado das interações em sistemas, garantindo histórico e rastreabilidade para suporte interno",
        "Colaboração com diferentes áreas para propor melhorias operacionais e reforçar a cultura de foco no cliente",
      ],
      metrics: [
        { key: "channels", value: "Multicanal" },
        { key: "experience", value: "3+ anos" },
      ],
    },
  ])

  const [skillCategories, setSkillCategories] = useState({
    "Business Intelligence": {
      icon: Database,
      skills: ["Power BI", "Microsoft Fabric", "DAX", "Linguagem M", "Power Query", "Dashboards Estratégicos"],
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    "Análise de Dados": {
      icon: Users2,
      skills: ["SQL", "Excel", "Knime", "Pentaho", "Python", "Ferramentas ETL"],
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    "Governança & Qualidade": {
      icon: Zap,
      skills: ["LGPD", "Governança de Dados", "Data Storytelling", "Testes A/B", "GitHub", "Benchmarking"],
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
    },
  })

  const [cases, setCases] = useState([
    {
      title: "Dashboards Estratégicos com KPIs Logísticos",
      description:
        "Criação e manutenção de dashboards em Power BI e Excel com KPIs logísticos, operacionais e de vendas, aplicando storytelling com dados",
      link: "https://linkedin.com/in/alicearagao",
      tags: ["Power BI", "KPIs", "Storytelling", "Excel"],
    },
    {
      title: "Automação ETL com Microsoft Fabric",
      description:
        "Análises preditivas e exploratórias utilizando Microsoft Fabric (Pipelines e Notebooks) para identificar padrões e oportunidades de negócio",
      link: "https://linkedin.com/in/alicearagao",
      tags: ["Microsoft Fabric", "ETL", "Análise Preditiva", "Notebooks"],
    },
    {
      title: "Segmentação de Clientes e Testes A/B",
      description:
        "Implementação de segmentação de clientes e testes A/B para campanhas direcionadas, aplicando conceitos de LGPD e governança de dados",
      link: "https://linkedin.com/in/alicearagao",
      tags: ["Segmentação", "Testes A/B", "LGPD", "Campanhas"],
    },
  ])

  const [certifications, setCertifications] = useState([
    {
      title: "Análise de Dados e Negócios com Microsoft Excel",
      link: "https://linkedin.com/in/alicearagao",
    },
    {
      title: "Administrando Banco de Dados",
      link: "https://linkedin.com/in/alicearagao",
    },
    {
      title: "Introdução à Análise de Dados - Microsoft Power BI",
      link: "https://linkedin.com/in/alicearagao",
    },
    {
      title: "Imersão Gratuita: Análise de Dados na Prática",
      link: "https://linkedin.com/in/alicearagao",
    },
    {
      title: "Santander Tech+ | Fundamentos Tech",
      link: "https://linkedin.com/in/alicearagao",
    },
  ])

  const [education, setEducation] = useState([
    {
      institution: "UniFTC",
      degree: "Acadêmica em Sistemas de Informação",
      period: "Em andamento",
    },
  ])

  const languages = [
    { name: "Português", level: "Nativo" },
    { name: "Inglês", level: "Intermediário" },
    { name: "Espanhol", level: "Intermediário" },
  ]

  // Load data from storage service and check for UTM
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Check for UTM parameter
        const urlParams = new URLSearchParams(window.location.search)
        const utm = urlParams.get("utm")
        const isPrint = urlParams.get("print")

        let data = null

        if (utm) {
          // Load specific version by UTM
          const versionData = await loadCVVersionByUTM(utm)
          if (versionData) {
            data = versionData.data
            toast({
              title: "Versão específica carregada",
              description: `Exibindo versão: ${versionData.name}`,
            })
          }
        }

        if (!data) {
          // Load default data
          data = await loadPortfolioData()
        }

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

          if (data.experiences) {
            const experiencesWithMetrics = data.experiences.map((exp) => ({
              ...exp,
              metrics: exp.metrics || [],
            }))
            setExperiences(experiencesWithMetrics)
          }

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
          if (data.certifications) setCertifications(data.certifications)
          if (data.education) setEducation(data.education)
        }

        // Load colors
        const colors = await loadColors()
        if (colors) {
          // Apply colors to CSS variables
          document.documentElement.style.setProperty("--primary-color", colors.primary)
          document.documentElement.style.setProperty("--secondary-color", colors.secondary)
          document.documentElement.style.setProperty("--accent-color", colors.accent)
          document.documentElement.style.setProperty("--background-color", colors.background)
        }

        // Auto-print if print parameter is present
        if (isPrint === "true") {
          setTimeout(() => {
            window.print()
          }, 2000)
        }

        // Mostrar aviso se o Supabase não estiver configurado
        if (!isSupabaseConfigured) {
          toast({
            title: "Modo local ativado",
            description: "Suas alterações serão salvas apenas neste navegador.",
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

  const handlePasswordSubmit = () => {
    if (passwordInput === "21081898") {
      setShowPasswordModal(false)
      setPasswordInput("")
      setPasswordError("")
      setIsEditing(true)
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

  const handleEditorClose = () => {
    setIsEditing(false)
  }

  const handleEditorSave = () => {
    // Reload the page to reflect changes
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-8 py-6 rounded-3xl shadow-lg">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="text-lg text-gray-700 font-medium">Carregando portfólio...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        .smooth-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .smooth-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; }
          .bg-gradient-to-br { background: white !important; }
          .shadow-sm, .shadow-md, .shadow-lg { box-shadow: none !important; }
          .rounded-3xl, .rounded-2xl, .rounded-xl { border-radius: 8px !important; }
          .border { border: 1px solid #e5e7eb !important; }
        }
      `}</style>

      {/* Portfolio Editor */}
      {isEditing && (
        <PortfolioEditor
          initialData={{
            profileData,
            stats,
            experiences,
            skillCategories,
            cases,
            certifications,
            education,
          }}
          onClose={handleEditorClose}
          onSave={handleEditorSave}
        />
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center no-print">
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-96 border border-white/20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Acesso ao Editor</h2>
            <p className="text-slate-600 mb-6 font-inter">Digite a senha para editar o portfólio:</p>
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Digite a senha"
              className="mb-4 h-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-2xl"
              onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
            />
            {passwordError && <p className="text-red-600 text-sm mb-4 font-medium">{passwordError}</p>}

            <div className="flex gap-3">
              <Button
                onClick={handlePasswordSubmit}
                className="flex-1 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white h-12 font-medium rounded-2xl smooth-hover"
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
                className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 h-12 rounded-2xl smooth-hover"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Email Popup */}
      {showEmailPopup && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center no-print">
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-2xl w-96 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Email de Contato</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEmailPopup(false)}
                className="h-8 w-8 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-800 flex items-center justify-center shadow-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Email</p>
                <p className="text-slate-800 font-medium">{profileData.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  window.open(`mailto:${profileData.email}`, "_blank")
                  setShowEmailPopup(false)
                }}
                className="flex-1 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white rounded-2xl smooth-hover"
              >
                Enviar Email
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(profileData.email)
                  toast({ title: "Email copiado!", description: "O email foi copiado para a área de transferência." })
                  setShowEmailPopup(false)
                }}
                className="flex-1 rounded-2xl smooth-hover"
              >
                Copiar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Phone Popup */}
      {showPhonePopup && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center no-print">
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-2xl w-96 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Telefone de Contato</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPhonePopup(false)}
                className="h-8 w-8 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Telefone</p>
                <p className="text-slate-800 font-medium">{profileData.phone}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  window.open(`tel:${profileData.phone}`, "_blank")
                  setShowPhonePopup(false)
                }}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-2xl smooth-hover"
              >
                Ligar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                 navigator.clipboard.writeText(`https://wa.me/${profileData.phone}`);
                  toast({
                    title: "Telefone copiado!",
                    description: "O telefone foi copiado para a área de transferência.",
                  })
                  setShowPhonePopup(false)
                }}
                className="flex-1 rounded-2xl smooth-hover"
              >
                Copiar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full bg-white/80 backdrop-blur-sm min-h-screen shadow-2xl">
        {/* Header Section */}
        <div className="p-0 border-b border-gray-100">
          {/* Navigation */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                FM
              </div>
              <span className="text-blue-700 font-semibold text-lg">Felipe Moura</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-gray-600 hover:text-blue-700 text-sm font-medium smooth-hover">
                <span className="hidden md:inline">Início</span>
              </a>
              <a href="#stats" className="text-gray-600 hover:text-blue-700 text-sm font-medium smooth-hover">
                <span className="hidden md:inline">Highlights</span>
              </a>
              <a href="#experience" className="text-gray-600 hover:text-blue-700 text-sm font-medium smooth-hover">
                <span className="hidden md:inline">Experiência</span>
              </a>
              <a href="#cases" className="text-gray-600 hover:text-blue-700 text-sm font-medium smooth-hover">
                <span className="hidden md:inline">Cases</span>
              </a>
              <a href="#education" className="text-gray-600 hover:text-blue-700 text-sm font-medium smooth-hover">
                <span className="hidden md:inline">Formação</span>
              </a>
              <a href="#skills" className="text-gray-600 hover:text-blue-700 text-sm font-medium smooth-hover">
                <span className="hidden md:inline">Habilidades</span>
              </a>
              <a href="#certifications" className="text-gray-600 hover:text-blue-700 text-sm font-medium smooth-hover">
                <span className="hidden md:inline">Certificações</span>
              </a>
            </div>
          </div>

          {/* Profile Section */}
          <div className="max-w-7xl mx-auto px-8 py-12 bg-gradient-to-r from-white/80 to-purple-50/50">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div
                  className="w-48 h-48 md:w-56 md:h-56 cursor-pointer hover:scale-105 smooth-hover rounded-3xl overflow-hidden relative shadow-2xl ring-4 ring-white/50"
                  onClick={handlePhotoClick}
                >
                  <img src="/images/felipe-photo.jpeg" alt="Profile Photo" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-r from-blue-700 to-blue-800 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{profileData.name}</h1>
                <p className="text-xl text-gray-700 mb-6 font-medium leading-relaxed">
                  Business Analyst | Estratégia & Eficiência Operacional
                </p>
                <p className="text-base text-gray-600 mb-8 leading-relaxed">
                  Analista de Negócios com experiência em liderar projetos estratégicos com foco em eficiência, escalabilidade e resultados orientados por dados. Atuo na interseção entre operações, tecnologia e produto, ajudando empresas a transformar métricas em ações concretas
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <Button
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-semibold px-8 py-3 h-auto rounded-2xl shadow-lg flex items-center gap-2 no-print smooth-hover"
                    onClick={() => profileData.cvUrl && window.open(profileData.cvUrl, "_blank")}
                  >
                    <Download className="w-5 h-5" />
                    Download CV
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="text-gray-600 hover:text-blue-700 hover:bg-purple-50 border-gray-200 rounded-2xl w-12 h-12 no-print smooth-hover"
                    onClick={() => setShowEmailPopup(true)}
                  >
                    <Mail className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="text-gray-600 hover:text-green-600 hover:bg-green-50 border-gray-200 rounded-2xl w-12 h-12 no-print smooth-hover"
                    onClick={() => setShowPhonePopup(true)}
                  >
                    <Phone className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="text-gray-600 hover:text-blue-700 hover:bg-purple-50 border-gray-200 rounded-2xl w-12 h-12 no-print smooth-hover"
                    onClick={() => profileData.linkedin && window.open(`https://${profileData.linkedin}`, "_blank")}
                  >
                    <Linkedin className="w-5 h-5" />
                  </Button>

                  <div className="flex items-center gap-2 text-gray-600 ml-auto bg-white/60 backdrop-blur-sm px-4 py-2 rounded-2xl border border-gray-100">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{profileData.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div id="stats" className="border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-purple-50/30">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Highlights</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50 smooth-hover"
                >
                  <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-800 flex items-center justify-center shadow-lg">
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div id="experience" className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Experiência Profissional</h2>
            </div>

            <div className="space-y-0">
              {experiences.map((exp, index) => (
                <div key={index}>
                  <div className="py-8">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{exp.title}</h3>
                        <p className="text-gray-700 font-semibold mb-4">{exp.company}</p>
                        <div className="flex gap-3 mb-4">
                          {exp.metrics.map((metric, metricIndex) => (
                            <Badge
                              key={metricIndex}
                              className="bg-gradient-to-r from-green-100 to-green-200 text-blue-700 hover:from-green-200 hover:to-green-300 border-0 rounded-2xl px-4 py-2 font-medium smooth-hover"
                            >
                              {metric.value}
                            </Badge>
                          ))}
                        </div>
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
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-700 to-blue-800 mt-2 flex-shrink-0 shadow-sm"></div>
                            <span className="text-gray-600 leading-relaxed">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Gradient separator line between experiences */}
                  {index < experiences.length - 1 && (
                    <div className="h-1 bg-gradient-to-r from-blue-700 to-blue-800 rounded-full shadow-sm"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cases & Projects Section */}
        <div id="cases" className="border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-purple-50/30">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Cases & Projetos</h2>
            </div>

            <div className="space-y-6">
              {cases.map((caseItem, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-8 shadow-lg smooth-hover"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{caseItem.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{caseItem.description}</p>
                      <div className="flex flex-wrap gap-3">
                        {caseItem.tags.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            className="bg-gradient-to-r from-green-100 to-green-200 text-blue-700 hover:from-green-200 hover:to-green-300 border-0 rounded-2xl px-4 py-2 font-medium smooth-hover"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white ml-6 no-print flex items-center gap-2 rounded-2xl px-6 py-3 shadow-lg smooth-hover"
                      onClick={() => window.open(caseItem.link, "_blank")}
                    >
                      Ver projeto
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div id="education" className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Formação Acadêmica</h2>
            </div>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-8 shadow-lg smooth-hover"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{edu.degree}</h3>
                      <p className="text-blue-700 font-semibold mb-4">{edu.institution}</p>
                      <p className="text-gray-600 leading-relaxed">{edu.period}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div id="skills" className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Habilidades & Competências</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(skillCategories).map(([category, data], index) => (
                <div
                  key={category}
                  className="rounded-3xl overflow-hidden border border-white/50 shadow-lg smooth-hover"
                >
                  <div className="p-6 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <data.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg">{category}</h3>
                    </div>
                  </div>
                  <div className="p-6 bg-white/80 backdrop-blur-sm">
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          className="bg-gray-100 text-gray-800 hover:bg-gray-200 py-2 px-3 rounded-2xl font-medium smooth-hover"
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
        </div>

        {/* Certifications and Languages Section */}
        <div className="bg-gradient-to-r from-gray-50/50 to-purple-50/30">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Certificações */}
              <div id="certifications">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Certificações</h2>
                </div>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 smooth-hover"
                    >
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 font-medium flex items-center gap-2 smooth-hover text-sm"
                      >
                        <span>{cert.title}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Idiomas</h2>
                </div>
                <div className="space-y-4">
                  {languages.map((lang, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 smooth-hover"
                    >
                      <span className="text-gray-900 font-semibold">{lang.name}</span>
                      <span className="text-gray-600 font-medium">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
