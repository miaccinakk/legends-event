import { NextResponse } from "next/server"
import { getEmail, updateEmailText, deleteEmail } from "@/lib/emails-store"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = (await request.json()) as { text?: string }

    if (!body?.text || !body.text.trim()) {
      return NextResponse.json({ error: "Missing text." }, { status: 400 })
    }

    const existing = await getEmail(id)
    if (!existing) {
      return NextResponse.json({ error: "Email not found." }, { status: 404 })
    }

    const email = await updateEmailText(id, body.text)
    return NextResponse.json({ email })
  } catch (error) {
    console.error("[v0] PATCH /api/emails/[id] error:", error)
    return NextResponse.json({ error: "Failed to update email." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const removed = await deleteEmail(id)
  if (!removed) return NextResponse.json({ error: "Email not found." }, { status: 404 })
  return NextResponse.json({ ok: true })
}
