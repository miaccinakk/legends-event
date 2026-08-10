import { NextResponse } from "next/server"
import { generateAIResponse } from "@/lib/ai"
import { buildContentPrompt, buildRefinePrompt, buildSectionPrompt } from "@/lib/prompts"
import type { PromptInput } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      kind: "section" | "content" | "refine"
      task?: string
      input?: PromptInput
      instructions?: string
      /* Refine-only fields */
      baseText?: string
      instruction?: string
      language?: string
      modelId?: string
    }

    let prompt: string

    if (body.kind === "refine") {
      if (!body?.baseText) {
        return NextResponse.json({ error: "Missing baseText to refine." }, { status: 400 })
      }
      prompt = buildRefinePrompt(body.baseText, body.instruction ?? "", {
        task: body.task,
        input: body.input,
        language: body.language,
      })
    } else {
      if (!body?.task || !body?.input) {
        return NextResponse.json({ error: "Missing task or input." }, { status: 400 })
      }
      prompt =
        body.kind === "content"
          ? buildContentPrompt(body.input, body.task, body.instructions)
          : buildSectionPrompt(body.input, body.task)
    }

    const text = await generateAIResponse(prompt, body.modelId)
    return NextResponse.json({ text })
  } catch (error) {
    console.error("[v0] /api/generate error:", error)
    return NextResponse.json({ error: "Failed to generate AI response." }, { status: 500 })
  }
}
