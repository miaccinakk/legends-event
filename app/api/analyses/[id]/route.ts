import { NextResponse } from "next/server"
import { deleteAnalysis } from "@/lib/analyses-store"

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const removed = await deleteAnalysis(id)
  if (!removed) return NextResponse.json({ error: "Analysis not found." }, { status: 404 })
  return NextResponse.json({ ok: true })
}
