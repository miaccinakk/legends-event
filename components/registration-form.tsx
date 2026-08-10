"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"

const roles = ["Founder / CEO", "Investor / LP", "C-level Operator", "Board Member", "Other"]

export function RegistrationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: roles[0],
    note: "",
  })

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "loading") return
    setStatus("loading")
    // Simulate submitting the request for host review.
    await new Promise((r) => setTimeout(r, 900))
    setStatus("done")
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full gold-fill text-primary-foreground">
          <Check className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <h3 className="text-xl font-semibold">Request received</h3>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          Your registration is now with the host for review. Seats are capped and the final list locks 24 hours before
          the session — we&apos;ll email <span className="text-foreground">{form.email || "you"}</span> once you&apos;re approved.
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">Reviewed personally</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-[0_0_60px_-20px_rgba(197,153,58,0.35)] sm:p-7"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Registration</p>
          <h3 className="mt-1 text-lg font-semibold">Request your seat</h3>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Approval required
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <Field label="Full name">
          <input
            required
            value={form.name}
            onChange={update("name")}
            placeholder="Jane Doe"
            className={inputClass}
          />
        </Field>
        <Field label="Email">
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="jane@company.com"
            className={inputClass}
          />
        </Field>
        <Field label="Company">
          <input
            required
            value={form.company}
            onChange={update("company")}
            placeholder="Where you operate"
            className={inputClass}
          />
        </Field>
        <Field label="You are a">
          <div className="relative">
            <select value={form.role} onChange={update("role")} className={`${inputClass} appearance-none pr-9`}>
              {roles.map((r) => (
                <option key={r} value={r} className="bg-card text-foreground">
                  {r}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              ▾
            </span>
          </div>
        </Field>
        <Field label="What are you building right now?" optional>
          <textarea
            rows={3}
            value={form.note}
            onChange={update("note")}
            placeholder="One line on what you're scaling."
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full gold-fill px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending request
          </>
        ) : (
          "Request Access"
        )}
      </button>
      <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
        A registration isn&apos;t a seat. Each request is reviewed individually. The session is recorded for internal
        use — by registering you consent to recording.
      </p>
    </form>
  )
}

const inputClass =
  "w-full rounded-xl border border-[var(--input)] bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"

function Field({
  label,
  optional,
  children,
}: {
  label: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
        {optional && <span className="ml-1 normal-case tracking-normal opacity-70">(optional)</span>}
      </span>
      {children}
    </label>
  )
}
