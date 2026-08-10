import { NextResponse } from "next/server"
import { readPeople, savePerson } from "@/lib/people-store"
import type { Person, PersonInput } from "@/lib/types"

export async function GET() {
  const people = await readPeople()
  return NextResponse.json({ people })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { input: PersonInput }

    if (!body?.input?.name?.trim()) {
      return NextResponse.json({ error: "Person name is required." }, { status: 400 })
    }

    const input = body.input
    const person: Person = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: input.name.trim(),
      role: input.role?.trim() || "",
      website: input.website?.trim() || "",
      links: input.links?.trim() || "",
      bio: input.bio?.trim() || "",
      experience: input.experience?.trim() || "",
      education: input.education?.trim() || "",
      additionalInfo: input.additionalInfo?.trim() || "",
    }

    await savePerson(person)
    return NextResponse.json({ person })
  } catch (error) {
    console.error("[v0] /api/people error:", error)
    return NextResponse.json({ error: "Failed to save person." }, { status: 500 })
  }
}
