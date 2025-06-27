import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"

export async function GET() {
  try {
    if (!isSupabaseConfigured) {
      console.log("Supabase não está configurado, usando dados padrão.")
      return NextResponse.json({ success: false, message: "Supabase não está configurado." }, { status: 200 })
    }

    const supabase = getSupabase()
    if (!supabase) {
      console.error("Não foi possível obter o cliente Supabase.")
      return NextResponse.json(
        { success: false, message: "Não foi possível obter o cliente Supabase." },
        { status: 500 },
      )
    }

    const { data, error } = await supabase.from("portfolio").select("*").eq("id", 1).single()

    if (error) {
      console.error("Erro ao carregar do Supabase:", error)
      return NextResponse.json({ success: false, message: "Falha ao carregar dados do Supabase." }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data?.content || null }, { status: 200 })
  } catch (error) {
    console.error("Erro ao processar a requisição:", error)
    return NextResponse.json({ success: false, message: "Erro ao processar a requisição." }, { status: 500 })
  }
}
