import { NextResponse } from "next/server"
import { deleteTemplate } from "@/lib/templates-store"

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const removed = await deleteTemplate(id)
  if (!removed) {
    return NextResponse.json({ error: "Template not found." }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
