import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"

export async function GET() {
  try {
    if (!isSupabaseConfigured) {
      console.log("Supabase não está configurado, usando cores padrão.")
      return NextResponse.json(
        {
          success: false,
          message: "Supabase não está configurado.",
          defaultColors: {
            primary: "#1F4E79",
            secondary: "#A8D5BA",
            accent: "#F4C430",
            background: "#F8FAFC",
          },
        },
        { status: 200 },
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

    const { data, error } = await supabase.from("portfolio_colors").select("*").eq("id", 1).single()

    if (error) {
      console.error("Erro ao carregar cores do Supabase:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Falha ao carregar cores do Supabase.",
          defaultColors: {
            primary: "#1F4E79",
            secondary: "#A8D5BA",
            accent: "#F4C430",
            background: "#F8FAFC",
          },
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, colors: data?.colors || null }, { status: 200 })
  } catch (error) {
    console.error("Erro ao processar a requisição:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar a requisição.",
        defaultColors: {
          primary: "#1F4E79",
          secondary: "#A8D5BA",
          accent: "#F4C430",
          background: "#F8FAFC",
        },
      },
      { status: 500 },
    )
  }
}
