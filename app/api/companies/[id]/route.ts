import { NextResponse } from "next/server"
import { getCompany, updateCompany, deleteCompany } from "@/lib/companies-store"
import type { CompanyInput } from "@/lib/types"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await getCompany(id)
  if (!company) return NextResponse.json({ error: "Company not found." }, { status: 404 })
  return NextResponse.json({ company })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = (await request.json()) as { input: CompanyInput }

    if (!body?.input?.name?.trim()) {
      return NextResponse.json({ error: "Company name is required." }, { status: 400 })
    }

    const input = body.input
    const company = await updateCompany(id, {
      name: input.name.trim(),
      website: input.website?.trim() || "",
      industry: input.industry?.trim() || "",
      targetMarket: input.targetMarket?.trim() || "",
      productDescription: input.productDescription?.trim() || "",
      businessGoals: input.businessGoals?.trim() || "",
      additionalInfo: input.additionalInfo?.trim() || "",
      links: input.links?.trim() || "",
    })

    if (!company) return NextResponse.json({ error: "Company not found." }, { status: 404 })
    return NextResponse.json({ company })
  } catch (error) {
    console.error("[v0] /api/companies/[id] PUT error:", error)
    return NextResponse.json({ error: "Failed to update company." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const removed = await deleteCompany(id)
  if (!removed) return NextResponse.json({ error: "Company not found." }, { status: 404 })
  return NextResponse.json({ ok: true })
}
