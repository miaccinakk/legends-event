"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Loader2,
  UserPlus,
  Save,
  ChevronDown,
  Plus,
  X,
  User,
  Share2,
  Briefcase,
  GraduationCap,
  Info,
  LinkIcon,
} from "lucide-react"
import { EMPTY_PERSON_INPUT, type PersonInput } from "@/lib/types"
import { inputClass } from "./field-cell"
import { AutoTextarea } from "./auto-textarea"

interface PersonFormProps {
  /** When provided, the form edits this person via PUT instead of creating a new one. */
  personId?: string
  /** Initial field values (defaults to an empty person). */
  initial?: PersonInput
}

type SectionId = "personal" | "social" | "experience" | "education" | "extra"

export function PersonForm({ personId, initial }: PersonFormProps) {
  const router = useRouter()
  const isEdit = Boolean(personId)
  const start = initial ?? EMPTY_PERSON_INPUT
  const [input, setInput] = useState<PersonInput>(start)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sections open by default when they already carry content (personal always open).
  const [open, setOpen] = useState<Record<SectionId, boolean>>({
    personal: true,
    social: start.links.trim().length > 0,
    experience: start.experience.trim().length > 0,
    education: start.education.trim().length > 0,
    extra: start.additionalInfo.trim().length > 0,
  })

  function toggle(id: SectionId) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function update(key: keyof PersonInput, value: string) {
    setInput((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(isEdit ? `/api/people/${personId}` : "/api/people", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      })
      if (!res.ok) throw new Error("Request failed")
      const data = (await res.json()) as { person: { id: string } }
      router.push(`/people/${data.person.id}`)
      router.refresh()
    } catch {
      setError(
        isEdit
          ? "Не удалось сохранить изменения. Попробуй ещё раз."
          : "Не удалось сохранить человека. Попробуй ещё раз.",
      )
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Личная информация */}
      <Section
        id="personal"
        icon={<User className="h-4 w-4" aria-hidden="true" />}
        title="Личная информация"
        description="Имя, роль, сайт и краткое описание человека"
        open={open.personal}
        onToggle={toggle}
      >
        <Field
          id="name"
          label="Имя"
          value={input.name}
          onChange={(v) => update("name", v)}
          placeholder="напр. Ахмед Аль-Мансури"
          required
        />
        <Field
          id="role"
          label="Роль / должность"
          value={input.role}
          onChange={(v) => update("role", v)}
          placeholder="напр. CEO, Head of Growth"
        />
        <Field
          id="website"
          label="Личный сайт"
          value={input.website}
          onChange={(v) => update("website", v)}
          placeholder="напр. ahmed.dev"
        />
        <Field
          id="bio"
          label="О человеке / характеристики"
          value={input.bio}
          onChange={(v) => update("bio", v)}
          placeholder="Кто это, бэкграунд, что для него важно, особенности…"
          type="textarea"
        />
      </Section>

      {/* Соцсети */}
      <Section
        id="social"
        icon={<Share2 className="h-4 w-4" aria-hidden="true" />}
        title="Соцсети"
        description="Добавляй ссылки по одной — LinkedIn, X, Telegram, Instagram…"
        open={open.social}
        onToggle={toggle}
      >
        <SocialLinksEditor value={input.links} onChange={(v) => update("links", v)} />
      </Section>

      {/* Опыт работы */}
      <Section
        id="experience"
        icon={<Briefcase className="h-4 w-4" aria-hidden="true" />}
        title="Опыт работы"
        description="Компании, роли, достижения"
        open={open.experience}
        onToggle={toggle}
      >
        <Field
          id="experience"
          label="Опыт работы"
          value={input.experience}
          onChange={(v) => update("experience", v)}
          placeholder="напр. 2020–наст. — CEO в Acme; 2016–2020 — Head of Growth в Beta…"
          type="textarea"
          rows={4}
          hideLabel
        />
      </Section>

      {/* Образование */}
      <Section
        id="education"
        icon={<GraduationCap className="h-4 w-4" aria-hidden="true" />}
        title="Образование"
        description="Вузы, степени, курсы"
        open={open.education}
        onToggle={toggle}
      >
        <Field
          id="education"
          label="Образование"
          value={input.education}
          onChange={(v) => update("education", v)}
          placeholder="напр. MBA, INSEAD, 2015; BSc Computer Science, MIT, 2011…"
          type="textarea"
          rows={4}
          hideLabel
        />
      </Section>

      {/* Доп. информация */}
      <Section
        id="extra"
        icon={<Info className="h-4 w-4" aria-hidden="true" />}
        title="Доп. информация"
        description="Интересы, тон общения, связи и всё остальное"
        open={open.extra}
        onToggle={toggle}
      >
        <Field
          id="additionalInfo"
          label="Доп. информация"
          value={input.additionalInfo}
          onChange={(v) => update("additionalInfo", v)}
          placeholder="Что ещё важно знать (интересы, тон общения, связи)…"
          type="textarea"
          rows={4}
          hideLabel
        />
      </Section>

      {error ? <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent-foreground">{error}</p> : null}

      <button
        type="submit"
        disabled={saving || !input.name.trim()}
        className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Создать человека
          </>
        )}
      </button>
    </form>
  )
}

/* -------------------------------------------------------------------------- */
/*  Collapsible section                                                        */
/* -------------------------------------------------------------------------- */

function Section({
  id,
  icon,
  title,
  description,
  open,
  onToggle,
  children,
}: {
  id: SectionId
  icon: React.ReactNode
  title: string
  description?: string
  open: boolean
  onToggle: (id: SectionId) => void
  children: React.ReactNode
}) {
  const bodyId = `section-${id}`
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/40"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-[15px] font-semibold tracking-tight text-foreground">{title}</span>
            {description ? <span className="truncate text-xs text-muted-foreground">{description}</span> : null}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div id={bodyId} className="flex flex-col gap-3 border-t border-border px-4 py-4">
          {children}
        </div>
      ) : null}
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Field                                                                      */
/* -------------------------------------------------------------------------- */

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "input",
  rows = 3,
  required = false,
  hideLabel = false,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hint?: string
  type?: "input" | "textarea"
  rows?: number
  required?: boolean
  hideLabel?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={`text-[13px] font-semibold tracking-tight text-foreground ${hideLabel ? "sr-only" : ""}`}
      >
        {label}
        {required ? <span className="ml-0.5 text-accent-foreground">*</span> : null}
      </label>
      {hint ? <p className="-mt-1 text-xs leading-snug text-muted-foreground">{hint}</p> : null}
      {type === "textarea" ? (
        <AutoTextarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          minRows={rows}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Social links editor — add one link at a time                               */
/* -------------------------------------------------------------------------- */

function SocialLinksEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const links = value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  const [draft, setDraft] = useState("")

  function setLinks(next: string[]) {
    onChange(next.join("\n"))
  }

  function addLink() {
    const v = draft.trim()
    if (!v) return
    if (links.includes(v)) {
      setDraft("")
      return
    }
    setLinks([...links, v])
    setDraft("")
  }

  function removeLink(index: number) {
    setLinks(links.filter((_, i) => i !== index))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      addLink()
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://linkedin.com/in/…"
          aria-label="Ссылка на соцсеть"
          className={inputClass}
        />
        <button
          type="button"
          onClick={addLink}
          disabled={!draft.trim()}
          aria-label="Добавить ссылку"
          className="inline-flex h-[46px] shrink-0 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="hidden sm:inline">Добавить</span>
        </button>
      </div>

      {links.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground">
          Пока нет ссылок. Вставь ссылку и нажми «Добавить».
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {links.map((link, i) => (
            <li
              key={`${link}-${i}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2"
            >
              <span className="flex min-w-0 items-center gap-2 text-sm text-foreground">
                <LinkIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="truncate">{link}</span>
              </span>
              <button
                type="button"
                onClick={() => removeLink(i)}
                aria-label={`Удалить ${link}`}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-accent-foreground"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
