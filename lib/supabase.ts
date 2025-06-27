import { createClient } from "@supabase/supabase-js"

// Use environment variables from Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey)

// Create a singleton Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (!supabaseInstance && isSupabaseConfigured && supabaseUrl && supabaseKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey)
  }
  return supabaseInstance
}

export interface ProfileData {
  name: string
  title: string
  summary: string
  email: string
  phone: string
  location: string
  linkedin: string
  cvUrl: string
  contactEmail: string
}

export interface Stat {
  label: string
  value: string
  icon: string
}

export interface Metric {
  key: string
  value: string
}

export interface Experience {
  title: string
  company: string
  period: string
  description: string
  achievements: string[]
  metrics: Metric[]
}

export interface SkillCategory {
  icon: string
  skills: string[]
  color: string
  bgColor: string
}

export interface Case {
  title: string
  description: string
  link: string
  tags: string[]
}

export interface Certification {
  title: string
  link: string
}

export interface Education {
  degree: string
  institution: string
  period: string
}

export interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  background: string
}

export interface PortfolioData {
  profile_data: ProfileData
  stats: Stat[]
  experiences: Experience[]
  skill_categories: Record<string, SkillCategory>
  cases: Case[]
  certifications: Certification[]
  education?: Education[]
  colors?: ColorScheme
}
