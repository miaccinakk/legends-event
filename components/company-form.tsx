"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Building2, Save } from "lucide-react"
import { EMPTY_COMPANY_INPUT, type CompanyInput } from "@/lib/types"
import { FieldCell } from "./field-cell"

interface FieldDef {
  key: keyof CompanyInput
  label: string
  placeholder: string
  hint?: string
  type?: "input" | "textarea"
  full?: boolean
}

const FIELDS: FieldDef[] = [
  { key: "name", label: "Компания", placeholder: "напр. MedHealth AI" },
  { key: "website", label: "Сайт", placeholder: "напр. medhealth.ai" },
  { key: "industry", label: "Отрасль", placeholder: "напр. Healthcare AI" },
  { key: "targetMarket", label: "Целевой рынок", placeholder: "напр. ОАЭ / MENA" },
  {
    key: "productDescription",
    label: "Что продаём / характеристики",
    placeholder: "Что делает продукт, для кого, чем особенна компания?",
    type: "textarea",
    full: true,
  },
  {
    key: "businessGoals",
    label: "Цель / бизнес-задачи",
    placeholder: "Чего компания пытается достичь?",
    type: "textarea",
    full: true,
  },
  {
    key: "links",
    label: "Ссылки (по желанию)",
    hint: "По одной в строке — сайт, LinkedIn, X, дек, пресса, доки…",
    placeholder: "https://…",
    type: "textarea",
    full: true,
  },
  {
    key: "additionalInfo",
    label: "Доп. информация",
    placeholder: "Что ещё важно знать (раунды, конкуренты, особенности)…",
    type: "textarea",
    full: true,
  },
]

interface CompanyFormProps {
  /** When provided, the form edits this company via PUT instead of creating a new one. */
  companyId?: string
  /** Initial field values (defaults to an empty company). */
  initial?: CompanyInput
}

export function CompanyForm({ companyId, initial }: CompanyFormProps) {
  const router = useRouter()
  const isEdit = Boolean(companyId)
  const [input, setInput] = useState<CompanyInput>(initial ?? EMPTY_COMPANY_INPUT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(key: keyof CompanyInput, value: string) {
    setInput((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(isEdit ? `/api/companies/${companyId}` : "/api/companies", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      })
      if (!res.ok) throw new Error("Request failed")
      const data = (await res.json()) as { company: { id: string } }
      router.push(`/companies/${data.company.id}`)
      router.refresh()
    } catch {
      setError(
        isEdit
          ? "Не удалось сохранить изменения. Попробуй ещё раз."
          : "Не удалось сохранить компанию. Попробуй ещё раз.",
      )
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-muted/40 p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FIELDS.map((f) => (
          <FieldCell
            key={f.key}
            id={f.key}
            label={f.label}
            value={input[f.key]}
            onValueChange={(v) => update(f.key, v)}
            placeholder={f.placeholder}
            hint={f.hint}
            type={f.type}
            full={f.full}
          />
        ))}
      </div>

      {error ? <p className="mt-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent-foreground">{error}</p> : null}

      <button
        type="submit"
        disabled={saving || !input.name.trim()}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Сохраняю…
          </>
        ) : isEdit ? (
          <>
            <Save className="h-4 w-4" aria-hidden="true" />
            Сохранить изменения
          </>
        ) : (
          <>
            <Building2 className="h-4 w-4" aria-hidden="true" />
            Создать компанию
          </>
        )}
      </button>
    </form>
  )
}
