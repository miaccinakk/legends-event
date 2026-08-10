"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { RegistrationForm } from "./registration-form"
import { APPLY_EVENT } from "./apply-button"

export function ApplyModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleOpen = () => setOpen(true)
    window.addEventListener(APPLY_EVENT, handleOpen)
    return () => window.removeEventListener(APPLY_EVENT, handleOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close application form"
        onClick={() => setOpen(false)}
        className="legends-overlay-in fixed inset-0 -z-10 cursor-default bg-black/80 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="legends-panel-in relative my-6 w-full max-w-2xl rounded-2xl border border-primary/25 bg-card p-6 shadow-[0_0_120px_-30px_rgba(197,153,58,0.55)] sm:p-9">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-7 max-w-md pr-8">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Apply to join</p>
          <h2 id="apply-modal-title" className="mt-3 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Request your seat at the session
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
            Seats are capped and the room is kept intentionally small. Every application is reviewed personally within
            72 hours.
          </p>
        </div>

        <RegistrationForm />
      </div>
    </div>
  )
}
