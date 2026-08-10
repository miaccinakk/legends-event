"use client"

import { useState } from "react"
import { Loader2, Sparkles, Save, Wand2, Pencil } from "lucide-react"
import type { PromptInput } from "@/lib/types"
import { inputClass } from "./field-cell"
import { FormattedText } from "./formatted-text"
import { CopyButton } from "./copy-button"

/**
 * A working draft with two ways to change it:
 *   1) manual editing in a textarea
 *   2) an AI rework pass, seeded by the current draft + a revision instruction
 *
 * Saving is delegated to the parent via `onSave` so the same block works for a
 * freshly generated variant (creator) and an already-saved email (detail page).
 */
export function EmailRefiner({
  baseText,
  task,
  contentLabel,
  context,
  language,
  modelId,
  onSave,
  saving,
  saveLabel = "Сохранить как новое письмо",
  error,
}: {
  baseText: string
  task: string
  contentLabel: string
  context: PromptInput | null
  language: string
  modelId: string
  onSave: (text: string) => void | Promise<void>
  saving: boolean
  saveLabel?: string
  error?: string | null
}) {
  const [draft, setDraft] = useState(baseText)
  const [instruction, setInstruction] = useState("")
  const [mode, setMode] = useState<"preview" | "edit">("preview")
  const [refining, setRefining] = useState(false)
  const [refineError, setRefineError] = useState<string | null>(null)

  async function refine() {
    setRefining(true)
    setRefineError(null)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "refine",
          task,
          input: context ?? undefined,
          baseText: draft,
          instruction,
          language,
          modelId,
        }),
      })
      if (!res.ok) throw new Error("Request failed")
      const data = (await res.json()) as { text: string }
      setDraft(data.text)
      setInstruction("")
    } catch {
      setRefineError("Не удалось доработать письмо. Попробуй ещё раз.")
    } finally {
      setRefining(false)
    }
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-primary/30 bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wand2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-foreground">Доработка письма</span>
            <span className="text-[11px] font-medium text-muted-foreground">{contentLabel}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => setMode("preview")}
              aria-pressed={mode === "preview"}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "preview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Просмотр
            </button>
            <button
              type="button"
              onClick={() => setMode("edit")}
              aria-pressed={mode === "edit"}
              className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "edit" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Pencil className="h-3 w-3" aria-hidden="true" />
              Правка
            </button>
          </div>
          <CopyButton text={draft} label="Копировать" />
        </div>
      </div>

      {/* Draft: preview or manual editor */}
      {mode === "edit" ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={14}
          className={`${inputClass} resize-y font-mono text-[13px] leading-relaxed`}
          aria-label="Текст письма"
        />
      ) : (
        <div className="min-h-24 whitespace-pre-wrap rounded-lg border border-border bg-background p-4">
          <FormattedText text={draft} />
        </div>
      )}

      {/* AI rework */}
      <div className="flex flex-col gap-2 rounded-lg border border-primary/25 bg-primary/5 p-3.5">
        <label htmlFor="refine-instruction" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Доработать через AI <span className="font-normal text-muted-foreground">(по желанию)</span>
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="refine-instruction"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="напр. сделай короче и добавь один чёткий CTA"
            className={inputClass}
          />
          <button
            type="button"
            onClick={refine}
            disabled={refining}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refining ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Дорабатываю…
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" aria-hidden="true" />
                Доработать
              </>
            )}
          </button>
        </div>
        <p className="text-[11px] leading-snug text-muted-foreground">
          AI возьмёт текущий текст за основу и перепишет его по твоей инструкции. Можно дорабатывать несколько раз.
        </p>
        {refineError ? <p className="text-xs text-accent-foreground">{refineError}</p> : null}
      </div>

      {error ? <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent-foreground">{error}</p> : null}

      <button
        type="button"
        onClick={() => onSave(draft)}
        disabled={saving || !draft.trim()}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:self-start"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Сохраняю…
          </>
        ) : (
          <>
            <Save className="h-4 w-4" aria-hidden="true" />
            {saveLabel}
          </>
        )}
      </button>
    </section>
  )
}
