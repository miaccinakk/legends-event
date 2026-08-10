"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"

const roles = [
  "Founder / Co-founder",
  "CEO / Managing Partner",
  "Owner / Shareholder",
  "C-level Executive",
  "Investor / Board",
  "Other",
]

const revenues = ["Under $1M", "$1–10M", "$10–50M", "$50–100M", "$100M+"]

type FormState = {
  fullName: string
  email: string
  phone: string
  company: string
  role: string
  revenue: string
  linkedin: string
  needs: string
  referrer: string
  consent: boolean
}

const initial: FormState = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  revenue: "",
  linkedin: "",
  needs: "",
  referrer: "",
  consent: false,
}

export function RegistrationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")
  const [form, setForm] = useState<FormState>(initial)

  const update =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const target = e.target
      const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value
      setForm((f) => ({ ...f, [key]: value }))
    }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "loading") return
    setStatus("loading")
    await new Promise((r) => setTimeout(r, 900))
    setStatus("done")
  }

  if (status === "done") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary text-primary">
          <Check className="h-7 w-7" strokeWidth={2.2} />
        </span>
        <h3 className="text-2xl font-semibold">Application submitted</h3>
        <p className="text-pretty leading-relaxed text-muted-foreground">
          We&apos;ll review your application and be in touch within 72 hours. Seats are capped and every request is
          reviewed personally — watch <span className="text-foreground">{form.email || "your inbox"}</span>.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-[0_0_80px_-30px_rgba(197,153,58,0.4)] sm:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" required className="sm:col-span-2">
          <input required value={form.fullName} onChange={update("fullName")} placeholder="Your full name" className={inputClass} />
        </Field>
        <Field label="Email" required>
          <input required type="email" value={form.email} onChange={update("email")} placeholder="you@company.com" className={inputClass} />
        </Field>
        <Field label="Phone (with country code)" required>
          <input required type="tel" value={form.phone} onChange={update("phone")} placeholder="+971 50 000 0000" className={inputClass} />
        </Field>
        <Field label="Company name" required className="sm:col-span-2">
          <input
            required
            value={form.company}
            onChange={update("company")}
            placeholder="Company you are most actively involved in"
            className={inputClass}
          />
        </Field>
        <Field label="Role" required>
          <Select value={form.role} onChange={update("role")}>
            <option value="">Select…</option>
            {roles.map((r) => (
              <option key={r} value={r} className="bg-card text-foreground">
                {r}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Company annual revenue" required help="Revenue of the company you operate — not personal income.">
          <Select value={form.revenue} onChange={update("revenue")}>
            <option value="">Select…</option>
            {revenues.map((r) => (
              <option key={r} value={r} className="bg-card text-foreground">
                {r}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="LinkedIn URL" required className="sm:col-span-2">
          <input
            required
            type="url"
            value={form.linkedin}
            onChange={update("linkedin")}
            placeholder="https://linkedin.com/in/..."
            className={inputClass}
          />
        </Field>
        <Field
          label="What would be the most valuable outcome of your networking right now?"
          required
          className="sm:col-span-2"
        >
          <textarea
            required
            rows={4}
            value={form.needs}
            onChange={update("needs")}
            placeholder="Be specific — the match you need most right now (a partner, investor, customer or deal) and what would make it valuable."
            className={`${inputClass} resize-none`}
          />
        </Field>
        <Field label="Who referred you?" optional className="sm:col-span-2">
          <input value={form.referrer} onChange={update("referrer")} placeholder="Member or partner name" className={inputClass} />
        </Field>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={update("consent")}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
        />
        <span>
          Legends may contact me by phone, SMS, and messaging apps about my application, events, and related offers, and
          such calls may be recorded. I can withdraw at any time. <span className="opacity-70">(Optional)</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full gold-fill px-6 py-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting
          </>
        ) : (
          <>Submit · We&apos;ll review &amp; be in touch →</>
        )}
      </button>
      <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
        By submitting, you agree to our{" "}
        <a href="#" className="text-primary underline-offset-2 hover:underline">
          Terms
        </a>{" "}
        &amp;{" "}
        <a href="#" className="text-primary underline-offset-2 hover:underline">
          Privacy
        </a>
        .
      </p>
    </form>
  )
}

const inputClass =
  "w-full rounded-xl border border-[var(--input)] bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"

function Select({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <select required value={value} onChange={onChange} className={`${inputClass} appearance-none pr-9`}>
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">▾</span>
    </div>
  )
}

function Field({
  label,
  optional,
  required,
  help,
  className = "",
  children,
}: {
  label: string
  optional?: boolean
  required?: boolean
  help?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
        {optional && <span className="ml-1 normal-case tracking-normal opacity-70">(optional)</span>}
      </span>
      {children}
      {help && <span className="text-xs normal-case tracking-normal text-muted-foreground/70">{help}</span>}
    </label>
  )
}
