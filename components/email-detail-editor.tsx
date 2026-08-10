"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, X } from "lucide-react"
import type { PromptInput } from "@/lib/types"
import { FormattedText } from "./formatted-text"
import { CopyButton } from "./copy-button"
import { ModelSelector } from "./model-selector"
import { EmailRefiner } from "./email-refiner"
import { DEFAULT_MODEL_ID } from "@/lib/models"

/**
 * The saved email on the detail page. Read-only by default; opening the editor
 * reveals the shared EmailRefiner so the письмо can be corrected by hand or
 * reworked through AI, then saved back over the original record.
 */
export function EmailDetailEditor({
  id,
  text,
  task,
  contentLabel,
  context,
  language,
}: {
  id: string
  text: string
  task: string
  contentLabel: string
  context: PromptInput
  language: string
}) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save(next: string) {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/emails/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: next }),
      })
      if (!res.ok) throw new Error("Save failed")
      setEditing(false)
      router.refresh()
    } catch {
      setError("Не удалось сохранить изменения. Попробуй ещё раз.")
    } finally {
      setSaving(false)
    }
  }

  if (!editing) {
    return (
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{contentLabel}</span>
          <div className="flex items-center gap-2">
            <CopyButton text={text} label="Копировать" />
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Редактировать
            </button>
          </div>
        </div>
        <div className="whitespace-pre-wrap">
          <FormattedText text={text} />
        </div>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <ModelSelector value={modelId} onChange={setModelId} />
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Отмена
        </button>
      </div>
      <EmailRefiner
        baseText={text}
        task={task}
        contentLabel={contentLabel}
        context={context}
        language={language}
        modelId={modelId}
        onSave={save}
        saving={saving}
        saveLabel="Сохранить изменения"
        error={error}
      />
    </div>
  )
}
