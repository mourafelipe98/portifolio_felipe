import { getSupabase, isSupabaseConfigured } from "./supabase"

// Local storage key
const LOCAL_STORAGE_KEY = "portfolio_data"
const LOCAL_COLORS_KEY = "portfolio_colors"

// Type definitions for our data
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

export interface CVVersion {
  id: string
  name: string
  utm: string
  data: PortfolioData
  created_at: string
  is_active: boolean
}

// Load data from API or localStorage
export const loadPortfolioData = async (): Promise<PortfolioData | null> => {
  try {
    // Try to load from API first
    if (isSupabaseConfigured) {
      const response = await fetch("/api/load-data")
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          return result.data as PortfolioData
        }
      }
    }

    // Fallback to localStorage if API failed or not configured
    if (typeof window !== "undefined") {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (localData) {
        return JSON.parse(localData) as PortfolioData
      }
    }

    return null
  } catch (error) {
    console.error("Error loading portfolio data:", error)
    return null
  }
}

// Save data via API or localStorage
export const savePortfolioData = async (data: PortfolioData): Promise<boolean> => {
  try {
    // Try to save via API first
    if (isSupabaseConfigured) {
      const response = await fetch("/api/update-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          return true
        }
      }
    }

    // Save to localStorage if API failed or not configured
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
      return true
    }

    return false
  } catch (error) {
    console.error("Error saving portfolio data:", error)
    return false
  }
}

// Load colors from API or localStorage
export const loadColors = async (): Promise<ColorScheme | null> => {
  try {
    // Try to load from API first
    if (isSupabaseConfigured) {
      const response = await fetch("/api/load-colors")
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.colors) {
          return result.colors as ColorScheme
        }
        // Return default colors if API returns them
        if (result.defaultColors) {
          return result.defaultColors as ColorScheme
        }
      }
    }

    // Fallback to localStorage
    if (typeof window !== "undefined") {
      const localColors = localStorage.getItem(LOCAL_COLORS_KEY)
      if (localColors) {
        return JSON.parse(localColors) as ColorScheme
      }
    }

    // Return default colors
    return {
      primary: "#1F4E79",
      secondary: "#A8D5BA",
      accent: "#F4C430",
      background: "#F8FAFC",
    }
  } catch (error) {
    console.error("Error loading colors:", error)
    return {
      primary: "#1F4E79",
      secondary: "#A8D5BA",
      accent: "#F4C430",
      background: "#F8FAFC",
    }
  }
}

// Save colors via API or localStorage
export const saveColors = async (colors: ColorScheme): Promise<boolean> => {
  try {
    // Try to save via API first
    if (isSupabaseConfigured) {
      const response = await fetch("/api/save-colors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(colors),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          return true
        }
      }
    }

    // Save to localStorage if API failed or not configured
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_COLORS_KEY, JSON.stringify(colors))
      return true
    }

    return false
  } catch (error) {
    console.error("Error saving colors:", error)
    return false
  }
}

// Load CV versions from Supabase or localStorage
export const loadCVVersions = async (): Promise<CVVersion[]> => {
  try {
    if (isSupabaseConfigured) {
      const supabase = getSupabase()
      if (supabase) {
        const { data, error } = await supabase.from("cv_versions").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error loading CV versions from Supabase:", error)
        } else if (data) {
          return data as CVVersion[]
        }
      }
    }

    // Fallback to localStorage
    if (typeof window !== "undefined") {
      const localVersions = localStorage.getItem("cv_versions")
      if (localVersions) {
        return JSON.parse(localVersions) as CVVersion[]
      }
    }

    return []
  } catch (error) {
    console.error("Error loading CV versions:", error)
    return []
  }
}

// Save CV version to Supabase or localStorage
export const saveCVVersion = async (version: Omit<CVVersion, "created_at">): Promise<boolean> => {
  try {
    const versionWithDate = {
      ...version,
      created_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured) {
      const supabase = getSupabase()
      if (supabase) {
        const { error } = await supabase.from("cv_versions").insert([versionWithDate])

        if (error) {
          console.error("Error saving CV version to Supabase:", error)
        } else {
          return true
        }
      }
    }

    // Save to localStorage
    if (typeof window !== "undefined") {
      const existingVersions = await loadCVVersions()
      const updatedVersions = [versionWithDate, ...existingVersions]
      localStorage.setItem("cv_versions", JSON.stringify(updatedVersions))
      return true
    }

    return false
  } catch (error) {
    console.error("Error saving CV version:", error)
    return false
  }
}

// Load CV version by UTM
export const loadCVVersionByUTM = async (utm: string): Promise<CVVersion | null> => {
  try {
    if (isSupabaseConfigured) {
      const supabase = getSupabase()
      if (supabase) {
        const { data, error } = await supabase
          .from("cv_versions")
          .select("*")
          .eq("utm", utm)
          .eq("is_active", true)
          .single()

        if (error) {
          console.error("Error loading CV version by UTM from Supabase:", error)
        } else if (data) {
          return data as CVVersion
        }
      }
    }

    // Fallback to localStorage
    const versions = await loadCVVersions()
    return versions.find((v) => v.utm === utm && v.is_active) || null
  } catch (error) {
    console.error("Error loading CV version by UTM:", error)
    return null
  }
}

// Update CV version status
export const updateCVVersionStatus = async (id: string, is_active: boolean): Promise<boolean> => {
  try {
    if (isSupabaseConfigured) {
      const supabase = getSupabase()
      if (supabase) {
        const { error } = await supabase.from("cv_versions").update({ is_active }).eq("id", id)

        if (error) {
          console.error("Error updating CV version status:", error)
        } else {
          return true
        }
      }
    }

    // Update in localStorage
    if (typeof window !== "undefined") {
      const versions = await loadCVVersions()
      const updatedVersions = versions.map((v) => (v.id === id ? { ...v, is_active } : v))
      localStorage.setItem("cv_versions", JSON.stringify(updatedVersions))
      return true
    }

    return false
  } catch (error) {
    console.error("Error updating CV version status:", error)
    return false
  }
}
