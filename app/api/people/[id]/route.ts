import { NextResponse } from "next/server"
import { getPerson, updatePerson, deletePerson } from "@/lib/people-store"
import type { PersonInput } from "@/lib/types"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const person = await getPerson(id)
  if (!person) return NextResponse.json({ error: "Person not found." }, { status: 404 })
  return NextResponse.json({ person })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = (await request.json()) as { input: PersonInput }

    if (!body?.input?.name?.trim()) {
      return NextResponse.json({ error: "Person name is required." }, { status: 400 })
    }

    const input = body.input
    const person = await updatePerson(id, {
      name: input.name.trim(),
      role: input.role?.trim() || "",
      website: input.website?.trim() || "",
      links: input.links?.trim() || "",
      bio: input.bio?.trim() || "",
      experience: input.experience?.trim() || "",
      education: input.education?.trim() || "",
      additionalInfo: input.additionalInfo?.trim() || "",
    })

    if (!person) return NextResponse.json({ error: "Person not found." }, { status: 404 })
    return NextResponse.json({ person })
  } catch (error) {
    console.error("[v0] /api/people/[id] PUT error:", error)
    return NextResponse.json({ error: "Failed to update person." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const removed = await deletePerson(id)
  if (!removed) return NextResponse.json({ error: "Person not found." }, { status: 404 })
  return NextResponse.json({ ok: true })
}
