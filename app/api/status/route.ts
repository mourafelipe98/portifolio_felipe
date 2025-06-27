import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"

export async function GET() {
  try {
    const status = {
      supabaseConfigured: isSupabaseConfigured,
      environmentVariables: {
        SUPABASE_URL: !!process.env.SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      connection: false,
    }

    if (isSupabaseConfigured) {
      const supabase = getSupabase()
      if (supabase) {
        try {
          const { error } = await supabase.from("portfolio").select("count", { count: "exact", head: true })
          status.connection = !error
        } catch (e) {
          console.error("Erro ao testar conexão:", e)
        }
      }
    }

    return NextResponse.json(status, { status: 200 })
  } catch (error) {
    console.error("Erro ao verificar status:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
