/**
 * =============================================================================
 *  AI INTEGRATION POINT
 * =============================================================================
 *
 *  Single place where the app talks to a language model. It supports multiple
 *  providers ("agents") selected per request:
 *
 *    - OpenAI    → reads OPENAI_API_KEY    (mid-level option, already working)
 *    - Anthropic → reads ANTHROPIC_API_KEY (advanced option — SCAFFOLD)
 *
 *  The Anthropic path is fully wired: just add ANTHROPIC_API_KEY to the project
 *  environment variables and the "Модель продвинутая" option starts working.
 *
 *  The rest of the app only depends on:
 *      generateAIResponse(prompt: string, modelId?: string) => Promise<string>
 * =============================================================================
 */

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { getModelOption } from "./models"

const SYSTEM_PROMPT =
  "You are a senior B2B go-to-market strategist and expert copywriter. " +
  "Follow the task and any custom instructions in the prompt precisely. " +
  "Be concise, specific, and immediately usable. Return only the requested content."

export async function generateAIResponse(prompt: string, modelId?: string): Promise<string> {
  const option = getModelOption(modelId)

  if (!process.env[option.envKey]) {
    throw new Error(
      `${option.envKey} is not set. Add it to your project environment variables to use "${option.label}".`,
    )
  }

  const model =
    option.provider === "anthropic" ? anthropic(option.model) : openai(option.model)

  const { text } = await generateText({
    model,
    system: SYSTEM_PROMPT,
    prompt,
    temperature: 0.7,
  })

  return text.trim()
}
