import type { PromptInput } from "./types"

/**
 * Builds a compact, structured context block shared by every prompt.
 * The [TASK: ...] marker lets the mock model route responses; a real model
 * simply reads it as plain instruction text.
 */
function companyContext(input: PromptInput): string {
  return [
    `Company: ${input.name || "N/A"}`,
    `Website: ${input.website || "N/A"}`,
    `Industry: ${input.industry || "N/A"}`,
    `Target market: ${input.targetMarket || "N/A"}`,
    `Product description: ${input.productDescription || "N/A"}`,
    `Business goals: ${input.businessGoals || "N/A"}`,
    `Additional information: ${input.additionalInfo || "N/A"}`,
    `Business links: ${input.links?.trim() ? input.links.replace(/\s*\n\s*/g, ", ") : "N/A"}`,
    ``,
    `[PEOPLE — contacts attached to this lead]`,
    input.people?.trim() ? input.people.trim() : "N/A",
    ``,
    `[EXCLUSIONS — hard filters, disqualify before scoring]`,
    `Exclude industries: ${input.excludeIndustries || "N/A"}`,
    `Exclude regions: ${input.excludeRegions || "N/A"}`,
    `Exclude company sizes: ${input.excludeSizes || "N/A"}`,
    `Stop-factors (if present, drop the lead, do not score): ${input.stopFactors || "N/A"}`,
    ``,
    `[PRIORITIZATION rules]`,
    `Must-have signals for high priority: ${input.mustHaveSignals || "N/A"}`,
    `Signals that raise priority: ${input.priorityCriteria || "N/A"}`,
    `Priority threshold: ${input.priorityThreshold || "N/A"}`,
  ].join("\n")
}

/**
 * Context block for a PERSON analysis. The subject is a specific person;
 * the company (if any) is only context. Filters/priorities read as person traits.
 */
function personContext(input: PromptInput): string {
  return [
    `[PERSON — the subject of this analysis]`,
    input.people?.trim() ? input.people.trim() : "N/A",
    ``,
    `[COMPANY CONTEXT — optional, the person is analyzed in relation to it]`,
    `Company: ${input.name || "N/A"}`,
    `Industry: ${input.industry || "N/A"}`,
    `Product / offer: ${input.productDescription || "N/A"}`,
    ``,
    `[EXCLUSIONS — red flags, disqualify before scoring]`,
    `Traits / profiles we do NOT want: ${input.personExclusions || "N/A"}`,
    `Stop-factors (if present, drop the person, do not score): ${input.stopFactors || "N/A"}`,
    ``,
    `[PRIORITIZATION rules]`,
    `Valuable traits / signals: ${input.personTraits || "N/A"}`,
    `Signals that raise priority: ${input.priorityCriteria || "N/A"}`,
    `Priority threshold: ${input.priorityThreshold || "N/A"}`,
  ].join("\n")
}

/** Pick the right context block for the analysis subject. */
function contextBlock(input: PromptInput): string {
  return input.subject === "person" ? personContext(input) : companyContext(input)
}

/**
 * Forces the response language when the user picked a specific one.
 * "Auto" (or empty) lets the model match the input language.
 */
function languageBlock(input: PromptInput): string {
  const lang = input.language?.trim()
  if (!lang || lang === "Auto") return ""
  return ["", `[LANGUAGE] Write the entire response in ${lang}, including headings and labels.`].join("\n")
}

/**
 * Appends the user's custom AI instructions (if any) as a high-priority
 * directive. `extra` carries per-generation instructions for a single asset.
 */
function guidanceBlock(input: PromptInput, extra?: string): string {
  const parts: string[] = []
  if (input.guidance?.trim()) parts.push(input.guidance.trim())
  if (extra?.trim()) parts.push(extra.trim())
  if (parts.length === 0) return ""
  return ["", `[CUSTOM INSTRUCTIONS — follow these closely]`, ...parts].join("\n")
}

export function buildSectionPrompt(input: PromptInput, task: string): string {
  const isPerson = input.subject === "person"
  return [
    `[TASK: ${task}]`,
    isPerson
      ? `You are a senior B2B relationship & sales strategist profiling an individual.`
      : `You are a senior B2B go-to-market strategist.`,
    isPerson
      ? `Using the person profile below, produce a concise, insightful "${task}". Focus on the individual, not the company.`
      : `Using the company profile below, produce a concise, insightful "${task}".`,
    ``,
    contextBlock(input),
    languageBlock(input),
    guidanceBlock(input),
  ]
    .filter(Boolean)
    .join("\n")
}

export function buildContentPrompt(input: PromptInput, task: string, instructions?: string): string {
  return [
    `[TASK: ${task}]`,
    `You are an expert B2B copywriter.`,
    `Write a ready-to-use "${task}" for the ${input.subject === "person" ? "person" : "company"} below. Keep it on-brand, specific, and persuasive.`,
    ``,
    contextBlock(input),
    languageBlock(input),
    guidanceBlock(input, instructions),
  ]
    .filter(Boolean)
    .join("\n")
}

/**
 * Refines an EXISTING draft. Used both when reworking a freshly generated
 * variant and when editing an already-saved email. The model is told to keep
 * what works and change only what the revision instruction asks for; the
 * optional context block keeps company/person facts available so edits stay
 * grounded. Returns only the final text.
 */
export function buildRefinePrompt(
  baseText: string,
  instruction: string,
  opts?: { task?: string; input?: PromptInput; language?: string },
): string {
  const input = opts?.input
  const lang = (opts?.language ?? input?.language)?.trim()
  const languageDirective =
    lang && lang !== "Auto" ? `\n[LANGUAGE] Write the entire response in ${lang}, including headings and labels.` : ""

  return [
    `[TASK: Refine ${opts?.task ?? "Email Outreach"}]`,
    `You are an expert B2B copywriter refining an existing draft.`,
    `Rework the draft below according to the revision instruction. Preserve everything that already works and change only what the instruction requires. Keep it specific, on-brand and ready to send. Return ONLY the final text — no preamble, no explanation.`,
    ``,
    `[CURRENT DRAFT]`,
    baseText?.trim() ? baseText.trim() : "N/A",
    ``,
    `[REVISION INSTRUCTION]`,
    instruction?.trim()
      ? instruction.trim()
      : "Improve clarity, flow and persuasiveness without changing the core message or intent.",
    input ? `\n[CONTEXT — facts you may use, do not contradict]\n${contextBlock(input)}` : "",
    languageDirective,
  ]
    .filter(Boolean)
    .join("\n")
}
