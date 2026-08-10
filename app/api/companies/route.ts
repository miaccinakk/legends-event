import { NextResponse } from "next/server"
import { readCompanies, saveCompany } from "@/lib/companies-store"
import type { Company, CompanyInput } from "@/lib/types"

export async function GET() {
  const companies = await readCompanies()
  return NextResponse.json({ companies })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { input: CompanyInput }

    if (!body?.input?.name?.trim()) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 })
    }

    const input = body.input
    const company: Company = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: input.name.trim(),
      website: input.website?.trim() || "",
      industry: input.industry?.trim() || "",
      targetMarket: input.targetMarket?.trim() || "",
      productDescription: input.productDescription?.trim() || "",
      businessGoals: input.businessGoals?.trim() || "",
      additionalInfo: input.additionalInfo?.trim() || "",
      links: input.links?.trim() || "",
    }

    await saveCompany(company)
    return NextResponse.json({ company })
  } catch (error) {
    console.error("[v0] /api/companies error:", error)
    return NextResponse.json({ error: "Failed to save company." }, { status: 500 })
  }
}
