"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { EMPTY_TEMPLATE_INPUT, type TemplateInput } from "@/lib/types"
import { FieldCell } from "./field-cell"

export function TemplateForm() {
  const router = useRouter()
  const [input, setInput] = useState<TemplateInput>(EMPTY_TEMPLATE_INPUT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(key: keyof TemplateInput, value: string) {
    setInput((prev) => ({ ...prev, [key]: value }))
  }

  const canSave = input.name.trim().length > 0 && input.text.trim().length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSave) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      })
      if (!res.ok) throw new Error("Request failed")
      router.push("/templates")
      router.refresh()
    } catch {
      setError("Не удалось сохранить шаблон. Попробуй ещё раз.")
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-muted/40 p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3">
        <FieldCell
          id="template-name"
          label="Название"
          value={input.name}
          onValueChange={(v) => update("name", v)}
          placeholder="напр. Холодное письмо — короткое"
        />
        <FieldCell
          id="template-text"
          label="Текст шаблона"
          hint="Базовая структура письма. Можешь использовать плейсхолдеры вроде [имя], [компания] — AI адаптирует их при генерации."
          value={input.text}
          onValueChange={(v) => update("text", v)}
          placeholder={"Привет, [имя]!\n\nЗаметил, что [компания]…\n\nБудет здорово созвониться на 15 минут — [CTA]."}
          type="textarea"
          rows={10}
          full
        />
      </div>

      {error ? <p className="mt-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent-foreground">{error}</p> : null}

      <button
        type="submit"
        disabled={saving || !canSave}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Сохраняю…
          </>
        ) : (
          <>
            <Save className="h-4 w-4" aria-hidden="true" />
            Сохранить шаблон
          </>
        )}
      </button>
    </form>
  )
}
