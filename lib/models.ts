/**
 * =============================================================================
 *  MODEL REGISTRY
 * =============================================================================
 *
 *  The app can run an analysis with different "agents" (models). Each option
 *  is described by its capability level rather than its raw model name, so the
 *  UI stays product-focused.
 *
 *  To activate a provider you only need to set its API key in the environment:
 *    - OpenAI (mid level):   OPENAI_API_KEY   (already wired, working)
 *    - Anthropic (advanced): ANTHROPIC_API_KEY (scaffold — add the key to use)
 * =============================================================================
 */

export type ModelProvider = "openai" | "anthropic"

export interface ModelOption {
  /** Stable id sent from the client to the API. */
  id: string
  /** Product-facing label (capability level, not the model name). */
  label: string
  /** Short description shown under the label. */
  description: string
  /** Which provider actually runs the request. */
  provider: ModelProvider
  /** Concrete model id passed to the provider. */
  model: string
  /** Env var that must be present for this option to work. */
  envKey: string
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "advanced",
    label: "Модель продвинутая",
    description: "Глубже рассуждает и точнее с нюансами — для сложных лидов.",
    provider: "anthropic",
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
    envKey: "ANTHROPIC_API_KEY",
  },
  /*
   * Скрытые варианты — раскомментируй, чтобы вернуть в UI.
   *
   * Модель среднего уровня (OpenAI) — быстрый и экономичный разбор:
   * {
   *   id: "mid",
   *   label: "Модель среднего уровня",
   *   description: "Быстрый и экономичный разбор — подходит для большинства лидов.",
   *   provider: "openai",
   *   model: process.env.OPENAI_MODEL || "gpt-4o-mini",
   *   envKey: "OPENAI_API_KEY",
   * },
   *
   * Модель продвинутая++ (заготовка на будущее):
   * {
   *   id: "advanced-plus",
   *   label: "Модель продвинутая++",
   *   description: "Максимальная глубина рассуждений — для самых сложных лидов.",
   *   provider: "anthropic",
   *   model: process.env.ANTHROPIC_MODEL_PLUS || "claude-opus-4-1",
   *   envKey: "ANTHROPIC_API_KEY",
   * },
   */
]

export const DEFAULT_MODEL_ID = "advanced"

export function getModelOption(id: string | undefined): ModelOption {
  return MODEL_OPTIONS.find((m) => m.id === id) ?? MODEL_OPTIONS[0]
}
