import { NextResponse } from "next/server"
import { readAnalyses, saveAnalysis } from "@/lib/analyses-store"
import { getCompany } from "@/lib/companies-store"
import { getPeopleByIds } from "@/lib/people-store"
import {
  EMPTY_ANALYSIS_CONFIG,
  type Analysis,
  type AnalysisConfig,
  type AnalysisResult,
  type AnalysisSubject,
} from "@/lib/types"

export async function GET() {
  const analyses = await readAnalyses()
  return NextResponse.json({ analyses })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      subject?: AnalysisSubject
      companyId?: string
      personIds?: string[]
      config: AnalysisConfig
      result: AnalysisResult
    }

    const subject: AnalysisSubject = body.subject === "person" ? "person" : "company"

    if (!body?.result) {
      return NextResponse.json({ error: "Missing result." }, { status: 400 })
    }

    // Company is required for a company analysis, optional context for a person analysis.
    const company = body.companyId ? await getCompany(body.companyId) : null
    if (subject === "company" && !company) {
      return NextResponse.json({ error: "Company not found." }, { status: 404 })
    }

    const personIds = Array.isArray(body.personIds) ? body.personIds : []
    const people = await getPeopleByIds(personIds)

    if (subject === "person" && people.length === 0) {
      return NextResponse.json({ error: "A person is required for a person analysis." }, { status: 400 })
    }

    const analysis: Analysis = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      subject,
      companyId: company?.id,
      companyName: company?.name,
      personIds: people.map((p) => p.id),
      personNames: people.map((p) => p.name),
      config: { ...EMPTY_ANALYSIS_CONFIG, ...body.config, subject },
      result: body.result,
    }

    await saveAnalysis(analysis)
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("[v0] /api/analyses error:", error)
    return NextResponse.json({ error: "Failed to save analysis." }, { status: 500 })
  }
}
