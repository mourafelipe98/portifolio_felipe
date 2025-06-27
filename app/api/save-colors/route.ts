import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured, type ColorScheme } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured) {
      console.error("Supabase não está configurado.")
      return NextResponse.json(
        {
          success: false,
          message: "Supabase não está configurado.",
          details: "Verifique as variáveis de ambiente",
        },
        { status: 500 },
      )
    }

    const supabase = getSupabase()
    if (!supabase) {
      console.error("Não foi possível obter o cliente Supabase.")
      return NextResponse.json(
        { success: false, message: "Não foi possível obter o cliente Supabase." },
        { status: 500 },
      )
    }

    const colors: ColorScheme = await request.json()

    // Validate required fields
    if (!colors.primary || !colors.secondary || !colors.accent || !colors.background) {
      return NextResponse.json(
        {
          success: false,
          message: "Dados inválidos: todas as cores são obrigatórias",
        },
        { status: 400 },
      )
    }

    const { error } = await supabase.from("portfolio_colors").upsert(
      {
        id: 1,
        colors: colors,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )

    if (error) {
      console.error("Erro ao salvar cores no Supabase:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Falha ao salvar cores no Supabase.",
          error: error.message,
          details: error.details,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Cores salvas com sucesso no Supabase.",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erro ao processar a requisição:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar a requisição.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
