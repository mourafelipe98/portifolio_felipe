import { NextResponse } from "next/server"
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase"

export async function GET() {
  try {
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase não está configurado.",
          details: "Verifique as variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY",
        },
        { status: 500 },
      )
    }

    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          message: "Não foi possível obter o cliente Supabase.",
        },
        { status: 500 },
      )
    }

    const tests = []

    // Test 1: Check portfolio table
    try {
      const { data: portfolioData, error: portfolioError } = await supabase
        .from("portfolio")
        .select("*")
        .eq("id", 1)
        .single()

      tests.push({
        test: "Portfolio Table",
        success: !portfolioError,
        data: portfolioData ? "Data found" : "No data",
        error: portfolioError?.message || null,
      })
    } catch (error) {
      tests.push({
        test: "Portfolio Table",
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 2: Check portfolio_colors table
    try {
      const { data: colorsData, error: colorsError } = await supabase
        .from("portfolio_colors")
        .select("*")
        .eq("id", 1)
        .single()

      tests.push({
        test: "Portfolio Colors Table",
        success: !colorsError,
        data: colorsData ? "Colors found" : "No colors",
        error: colorsError?.message || null,
      })
    } catch (error) {
      tests.push({
        test: "Portfolio Colors Table",
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 3: Check cv_versions table
    try {
      const { data: cvData, error: cvError } = await supabase
        .from("cv_versions")
        .select("count", { count: "exact", head: true })

      tests.push({
        test: "CV Versions Table",
        success: !cvError,
        data: `Count check completed`,
        error: cvError?.message || null,
      })
    } catch (error) {
      tests.push({
        test: "CV Versions Table",
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 4: Test insert/update
    try {
      const testData = {
        profile_data: {
          name: "Test User",
          title: "Test Title",
          summary: "Test Summary",
          email: "test@example.com",
          phone: "123456789",
          location: "Test Location",
          linkedin: "test-linkedin",
          cvUrl: "",
          contactEmail: "test@example.com",
        },
        stats: [],
        experiences: [],
        skill_categories: {},
        cases: [],
        certifications: [],
      }

      const { error: updateError } = await supabase
        .from("portfolio")
        .update({ content: testData, updated_at: new Date().toISOString() })
        .eq("id", 1)

      tests.push({
        test: "Update Test",
        success: !updateError,
        data: "Update operation completed",
        error: updateError?.message || null,
      })
    } catch (error) {
      tests.push({
        test: "Update Test",
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    const allTestsPassed = tests.every((test) => test.success)

    return NextResponse.json(
      {
        success: allTestsPassed,
        message: allTestsPassed ? "Todos os testes passaram!" : "Alguns testes falharam",
        tests,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erro ao testar banco de dados:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao testar banco de dados",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
