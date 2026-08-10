"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2, Check, X } from "lucide-react"

interface DeleteButtonProps {
  /** API endpoint that responds to DELETE, e.g. `/api/emails/123`. */
  endpoint: string
  /** Human label used in the confirm tooltip / aria-label, e.g. «письмо Acme». */
  itemLabel: string
  /**
   * Where to go after a successful delete.
   * - omitted → refresh the current route (used in lists)
   * - a path → navigate there (used on detail pages)
   */
  redirectTo?: string
  /** "icon" (compact, for list rows) or "full" (labelled button, for detail pages). */
  variant?: "icon" | "full"
  className?: string
}

/**
 * Delete control with a two-step inline confirmation.
 * First click reveals «Удалить / Отмена»; confirming fires the DELETE request.
 */
export function DeleteButton({
  endpoint,
  itemLabel,
  redirectTo,
  variant = "icon",
  className = "",
}: DeleteButtonProps) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(false)

  async function remove() {
    setDeleting(true)
    setError(false)
    try {
      const res = await fetch(endpoint, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      if (redirectTo) {
        router.push(redirectTo)
        router.refresh()
      } else {
        router.refresh()
      }
    } catch {
      setError(true)
      setDeleting(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1" role="group" aria-label="Подтверждение удаления">
        <button
          type="button"
          onClick={remove}
          disabled={deleting}
          className="inline-flex h-8 items-center gap-1 rounded-md bg-destructive px-2.5 text-xs font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {deleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          Удалить
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Отмена
        </button>
      </span>
    )
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Удалить ${itemLabel}`}
        title={error ? "Не удалось удалить, попробуйте ещё раз" : undefined}
        className={`inline-flex items-center justify-center gap-2 rounded-lg border border-destructive/40 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 ${className}`}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Удалить
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label={`Удалить ${itemLabel}`}
      title={error ? "Не удалось удалить, попробуйте ещё раз" : "Удалить"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive ${className}`}
    >
      <Trash2 className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
