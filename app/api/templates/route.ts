import { NextResponse } from "next/server"
import { readTemplates, saveTemplate } from "@/lib/templates-store"
import type { Template, TemplateInput } from "@/lib/types"

export async function GET() {
  const templates = await readTemplates()
  return NextResponse.json({ templates })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { input: TemplateInput }
    const input = body?.input

    if (!input?.name?.trim() || !input?.text?.trim()) {
      return NextResponse.json({ error: "Missing name or text." }, { status: 400 })
    }

    const template: Template = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: input.name.trim(),
      text: input.text,
    }

    await saveTemplate(template)
    return NextResponse.json({ template })
  } catch (error) {
    console.error("[v0] /api/templates error:", error)
    return NextResponse.json({ error: "Failed to save template." }, { status: 500 })
  }
}
