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

-- Insert default portfolio data
INSERT INTO portfolio (id, content) VALUES (1, '{
  "profile_data": {
    "name": "Felipe Moura",
    "title": "Business Analyst | Estratégia & Eficiência Operacional",
    "summary": "Analista de Negócios com experiência em liderar projetos estratégicos com foco em eficiência, escalabilidade e resultados orientados por dados.",
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
      "title": "Business Analyst",
      "company": "Tech Solutions",
      "period": "2022 - Presente",
      "description": "Liderança de projetos estratégicos focados em eficiência operacional",
      "achievements": [
        "Implementação de processos que reduziram custos em 35%",
        "Coordenação de equipes multidisciplinares",
        "Análise de dados para tomada de decisões estratégicas"
      ],
      "metrics": [
        {"key": "Redução de Custos", "value": "35%"},
        {"key": "Projetos Entregues", "value": "20+"}
      ]
    }
  ],
  "skill_categories": {
    "Análise": {
      "icon": "BarChart3",
      "skills": ["Power BI", "Excel Avançado", "SQL", "Python"],
      "color": "text-blue-600",
      "bgColor": "bg-blue-50"
    },
    "Gestão": {
      "icon": "Users",
      "skills": ["Scrum", "Kanban", "Liderança", "Comunicação"],
      "color": "text-green-600",
      "bgColor": "bg-green-50"
    },
    "Tecnologia": {
      "icon": "Code",
      "skills": ["JavaScript", "React", "Node.js", "APIs"],
      "color": "text-purple-600",
      "bgColor": "bg-purple-50"
    }
  },
  "cases": [
    {
      "title": "Otimização de Processos",
      "description": "Implementação de sistema automatizado que reduziu tempo de processamento em 60%",
      "link": "#",
      "tags": ["Automação", "Eficiência", "ROI"]
    },
    {
      "title": "Dashboard Executivo",
      "description": "Desenvolvimento de dashboard em Power BI para acompanhamento de KPIs estratégicos",
      "link": "#",
      "tags": ["Power BI", "KPIs", "Visualização"]
    }
  ],
  "certifications": [
    {
      "title": "Microsoft Power BI Data Analyst",
      "link": "https://learn.microsoft.com/en-us/certifications/power-bi-data-analyst-associate/"
    },
    {
      "title": "Scrum Master Certified",
      "link": "https://www.scrum.org/professional-scrum-master-certifications"
    }
  ]
}');

-- Insert default color scheme
INSERT INTO portfolio_colors (id, colors) VALUES (1, '{
  "primary": "#1F4E79",
  "secondary": "#A8D5BA", 
  "accent": "#F4C430",
  "background": "#F8FAFC"
}');

-- Insert sample CV version
INSERT INTO cv_versions (id, name, utm, data) VALUES (
  'default',
  'CV Padrão',
  'cv-padrao',
  '{
    "profile_data": {
      "name": "Felipe Moura",
      "title": "Business Analyst",
      "email": "felipegoncalvesmoura@gmail.com",
      "phone": "+55 (77) 98119-8998"
    },
    "experiences": [],
    "skills": [],
    "certifications": []
  }'
);

-- Verify data insertion
SELECT 'Portfolio data inserted' as status, count(*) as records FROM portfolio;
SELECT 'Color data inserted' as status, count(*) as records FROM portfolio_colors;
SELECT 'CV versions inserted' as status, count(*) as records FROM cv_versions;
