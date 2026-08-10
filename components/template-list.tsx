"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Clock, Trash2, Loader2 } from "lucide-react"
import type { Template } from "@/lib/types"
import { formatDate } from "@/lib/format"
import { CopyButton } from "./copy-button"

export function TemplateList({ templates }: { templates: Template[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function remove(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/templates/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      router.refresh()
    } catch {
      setDeletingId(null)
    }
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {templates.map((template) => (
        <li
          key={template.id}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3.5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-sm font-semibold tracking-tight text-card-foreground">
                  {template.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {formatDate(template.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <CopyButton text={template.text} label="Копировать" />
              <button
                type="button"
                onClick={() => remove(template.id)}
                disabled={deletingId === template.id}
                aria-label={`Удалить шаблон «${template.name}»`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingId === template.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          <p className="line-clamp-4 whitespace-pre-wrap rounded-lg bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            {template.text}
          </p>
        </li>
      ))}
    </ul>
  )
}
