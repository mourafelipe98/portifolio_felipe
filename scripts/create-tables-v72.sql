-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS cv_versions CASCADE;
DROP TABLE IF EXISTS portfolio_colors CASCADE;
DROP TABLE IF EXISTS portfolio CASCADE;

-- Create portfolio table for main portfolio data
CREATE TABLE portfolio (
  id INTEGER PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio_colors table for color schemes
CREATE TABLE portfolio_colors (
  id INTEGER PRIMARY KEY,
  colors JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cv_versions table for CV versions with UTM tracking
CREATE TABLE cv_versions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  utm TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX idx_cv_versions_utm ON cv_versions(utm);
CREATE INDEX idx_cv_versions_active ON cv_versions(is_active);
CREATE INDEX idx_cv_versions_created_at ON cv_versions(created_at);

-- Insert complete portfolio data (Version 72)
INSERT INTO portfolio (id, content) VALUES (1, '{
  "profile_data": {
    "name": "Felipe Moura",
    "title": "Business Analyst | Estratégia & Eficiência Operacional",
    "summary": "Analista de Negócios com experiência em liderar projetos estratégicos com foco em eficiência, escalabilidade e resultados orientados por dados. Atuo na interseção entre operações, tecnologia e produto, ajudando empresas a transformar métricas em ações concretas.",
    "email": "felipegoncalvesmoura@gmail.com",
    "phone": "+55 (77) 98119-8998",
    "location": "Vitória da Conquista, Bahia",
    "linkedin": "linkedin.com/in/felipegmoura",
    "cvUrl": "",
    "contactEmail": "felipegoncalvesmoura@gmail.com"
  },
  "stats": [
    {"label": "Negócios Entrevistados", "value": "15+", "icon": "Target"},
    {"label": "Projetos Concluídos", "value": "20+", "icon": "Users"},
    {"label": "Redução de Custos", "value": "35%", "icon": "TrendingUp"},
    {"label": "Anos Experiência", "value": "4+", "icon": "Star"}
  ],
  "experiences": [
    {
      "title": "Analista de Negócios Sênior | Produtos Recorrentes",
      "company": "Woba",
      "period": "abril de 2025 - Present",
      "description": "Atuação estratégica e operacional como ponto de convergência entre operações, negócios e tecnologia, com forte enfoque na identificação e execução de oportunidades de melhorias.",
      "achievements": [
        "Liderança de projetos críticos com um produto principal, gerenciando uma equipe de dois analistas",
        "Análise de dados e criação de soluções de automação (low/no-code) para otimizar processos",
        "Implementação de estratégias para otimização de processos, com aplicação da metodologia RACI"
      ],
      "metrics": [
        {"key": "team", "value": "2 analistas"},
        {"key": "impact", "value": "30% redução tempo"}
      ]
    },
    {
      "title": "Analista de Negócios Pleno | Produtos sob Demanda",
      "company": "Woba",
      "period": "outubro de 2024 - abril de 2025",
      "description": "Liderança de projetos em área com 2 produtos e 7 analistas, acompanhando métricas de volume, eficiência e qualidade.",
      "achievements": [
        "Lançamento de nova Pipeline com redução de 30% no tempo do fechamento dos tickets",
        "Diminuição da quantidade de SLAs vencidos",
        "Calculadora no-code que gera conversão 70% maior nos ativos cadastrados"
      ],
      "metrics": [
        {"key": "team", "value": "7 analistas"},
        {"key": "impact", "value": "70% conversão"}
      ]
    },
    {
      "title": "CS Coordenador de Suporte",
      "company": "Frexco",
      "period": "fevereiro de 2022 - março de 2022",
      "description": "Acompanhamento e análise de KPIs (Tempo de espera, CSAT, NPs, Churn, etc.) para uma equipe de 8 atendentes, com foco em gestão de pessoas e processos.",
      "achievements": [
        "Gestão de equipe de 8 atendentes com foco em desenvolvimento pessoal",
        "Criação e execução de processos (playbooks, atualização de plataformas)",
        "Apoio a setores como IT e logística"
      ],
      "metrics": [
        {"key": "team", "value": "8 atendentes"},
        {"key": "focus", "value": "Gestão pessoas"}
      ]
    }
  ],
  "skill_categories": {
    "Análise de Dados": {
      "icon": "Database",
      "skills": ["SQL", "Power BI", "Looker", "Google Sheets", "Análise de Dados", "Processos Data-Driven"],
      "color": "from-blue-500 to-blue-600",
      "bgColor": "from-blue-50 to-blue-100"
    },
    "CRM & Gestão": {
      "icon": "Users2",
      "skills": ["HubSpot", "Pipefy", "Descoberta de produtos", "Análise de requisitos", "Liderança de Projetos"],
      "color": "from-purple-500 to-purple-600",
      "bgColor": "from-purple-50 to-purple-100"
    },
    "Automação & Processos": {
      "icon": "Zap",
      "skills": ["Zapier", "Make", "n8n", "BPMN", "Melhoria Contínua"],
      "color": "from-orange-500 to-orange-600",
      "bgColor": "from-orange-50 to-orange-100"
    }
  },
  "cases": [
    {
      "title": "Otimização de Pipeline de Vendas",
      "description": "Implementação de automação que reduziu 30% do tempo de fechamento de tickets",
      "link": "https://notion.so/exemplo1",
      "tags": ["Automação", "Vendas", "Eficiência"]
    },
    {
      "title": "Dashboard de Métricas Operacionais",
      "description": "Criação de dashboard estratégico para monitoramento de produtividade",
      "link": "https://notion.so/exemplo2",
      "tags": ["Analytics", "Dashboard", "KPIs"]
    }
  ],
  "certifications": [
    {
      "title": "Lei Geral de Proteção de Dados (LGPD)",
      "link": "https://exemplo.com/lgpd"
    },
    {
      "title": "SQL: a linguagem dos bancos de dados",
      "link": "https://exemplo.com/sql"
    },
    {
      "title": "Pocket Agil - Agilidade de forma simples e fácil de entender",
      "link": "https://exemplo.com/agil"
    },
    {
      "title": "Tecnologia para Product Managers",
      "link": "https://exemplo.com/product"
    },
    {
      "title": "Métricas de Negócios Digitais",
      "link": "https://exemplo.com/metricas"
    }
  ]
}');

-- Insert default color scheme (Version 72)
INSERT INTO portfolio_colors (id, colors) VALUES (1, '{
  "primary": "#1F4E79",
  "secondary": "#A8D5BA", 
  "accent": "#F4C430",
  "background": "#F8FAFC"
}');

-- Insert sample CV version
INSERT INTO cv_versions (id, name, utm, data, is_active) VALUES (
  'cv-padrao-v72',
  'CV Padrão - Versão 72',
  'cv-padrao',
  '{
    "profile_data": {
      "name": "Felipe Moura",
      "title": "Business Analyst | Estratégia & Eficiência Operacional",
      "summary": "Analista de Negócios com experiência em liderar projetos estratégicos com foco em eficiência, escalabilidade e resultados orientados por dados.",
      "email": "felipegoncalvesmoura@gmail.com",
      "phone": "+55 (77) 98119-8998",
      "location": "Vitória da Conquista, Bahia",
      "linkedin": "linkedin.com/in/felipegmoura",
      "contactEmail": "felipegoncalvesmoura@gmail.com"
    },
    "experiences": [
      {
        "title": "Analista de Negócios Sênior",
        "company": "Woba",
        "period": "abril de 2025 - Present",
        "description": "Atuação estratégica e operacional como ponto de convergência entre operações, negócios e tecnologia.",
        "achievements": [
          "Liderança de projetos críticos com um produto principal",
          "Análise de dados e criação de soluções de automação",
          "Implementação de estratégias para otimização de processos"
        ],
        "metrics": [
          {"key": "team", "value": "2 analistas"},
          {"key": "impact", "value": "30% redução tempo"}
        ]
      }
    ],
    "skill_categories": {
      "Análise de Dados": {
        "icon": "Database",
        "skills": ["SQL", "Power BI", "Looker", "Google Sheets"],
        "color": "from-blue-500 to-blue-600",
        "bgColor": "from-blue-50 to-blue-100"
      }
    },
    "cases": [
      {
        "title": "Otimização de Pipeline de Vendas",
        "description": "Implementação de automação que reduziu 30% do tempo de fechamento de tickets",
        "link": "https://notion.so/exemplo1",
        "tags": ["Automação", "Vendas", "Eficiência"]
      }
    ],
    "certifications": [
      {
        "title": "Lei Geral de Proteção de Dados (LGPD)",
        "link": "https://exemplo.com/lgpd"
      }
    ]
  }',
  true
);

-- Verify data insertion
SELECT 'Portfolio data inserted' as status, count(*) as records FROM portfolio;
SELECT 'Color data inserted' as status, count(*) as records FROM portfolio_colors;
SELECT 'CV versions inserted' as status, count(*) as records FROM cv_versions;

-- Show sample data
SELECT 'Portfolio Content Preview' as info, 
       content->'profile_data'->>'name' as name,
       content->'profile_data'->>'title' as title
FROM portfolio WHERE id = 1;
