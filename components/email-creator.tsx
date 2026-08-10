"use client"

import { useMemo, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Loader2,
  Sparkles,
  Languages,
  Building2,
  Linkedin,
  Mail,
  CalendarDays,
  Twitter,
  Clapperboard,
  Lightbulb,
  FileText,
  LineChart,
  User,
  Check,
  Wand2,
} from "lucide-react"
import {
  ANALYSIS_SECTIONS,
  CONTENT_TYPES,
  LANGUAGES,
  buildPromptInput,
  type Analysis,
  type Company,
  type ContentTypeKey,
  type Person,
  type PromptInput,
  type Template,
} from "@/lib/types"
import { DEFAULT_MODEL_ID } from "@/lib/models"
import { inputClass } from "./field-cell"
import { FormattedText } from "./formatted-text"
import { CopyButton } from "./copy-button"
import { ModelSelector } from "./model-selector"
import { EmailRefiner } from "./email-refiner"
import { AutoTextarea } from "./auto-textarea"

/** How many variants can be generated at once. */
const VARIANT_COUNTS = [1, 2, 3, 4] as const

const ICONS: Record<ContentTypeKey, typeof Linkedin> = {
  linkedin: Linkedin,
  email: Mail,
  event: CalendarDays,
  twitter: Twitter,
  video: Clapperboard,
  ideas: Lightbulb,
}

/** Content formats shown in the picker — the Video / Avatar script is hidden for now. */
const VISIBLE_CONTENT_TYPES = CONTENT_TYPES.filter((t) => t.key !== "video")

/**
 * One "source" of the письмо (company / analysis / person). Each lives in its own
 * card that lights up when a value is chosen, so the picking logic reads clearly
 * and the three choices feel independent rather than three selects in a row.
 */
function SourceField({
  icon: Icon,
  title,
  active,
  children,
}: {
  icon: typeof Building2
  title: string
  active: boolean
  children: ReactNode
}) {
  return (
    <div
      className={`relative flex flex-col gap-3 rounded-xl border p-4 transition-colors ${
        active ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
            active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-[13px] font-semibold tracking-tight text-foreground">{title}</span>
          <span className={`text-[11px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
            {active ? "Учитываем" : "По желанию"}
          </span>
        </div>
        {active ? <Check className="ml-auto h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> : null}
      </div>
      {children}
    </div>
  )
}

export function EmailCreator({
  companies,
  people,
  analyses,
  templates,
  preselectedCompanyId,
  preselectedAnalysisId,
}: {
  companies: Company[]
  people: Person[]
  analyses: Analysis[]
  templates: Template[]
  preselectedCompanyId?: string
  preselectedAnalysisId?: string
}) {
  const router = useRouter()
  const [companyId, setCompanyId] = useState<string>(
    preselectedCompanyId && companies.some((c) => c.id === preselectedCompanyId)
      ? preselectedCompanyId
      : companies[0]?.id ?? "",
  )
  const [analysisId, setAnalysisId] = useState<string>(preselectedAnalysisId ?? "")
  const [personId, setPersonId] = useState<string>("")
  const [contentType, setContentType] = useState<ContentTypeKey>("email")
  const [templateId, setTemplateId] = useState<string>("")
  const [instructions, setInstructions] = useState("")
  const [language, setLanguage] = useState<string>("Auto")
  const [guidance, setGuidance] = useState("")
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID)
  const [variantCount, setVariantCount] = useState<number>(1)
  const [outputs, setOutputs] = useState<string[]>([])
  const [baseIndex, setBaseIndex] = useState<number | null>(null)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* The three sources are fully independent — pick any one, two or all three. */
  const company = useMemo(() => companies.find((c) => c.id === companyId), [companies, companyId])
  const selectedAnalysis = useMemo(() => analyses.find((a) => a.id === analysisId), [analyses, analysisId])
  const selectedPerson = useMemo(() => people.find((p) => p.id === personId), [people, personId])

  /* At least one source must be chosen before a письмо can be generated. */
  const hasSource = Boolean(company || selectedAnalysis || selectedPerson)

  /** Short label for an analysis option — its subject (company or person) + date. */
  function analysisLabel(a: Analysis) {
    const subject = a.subject === "person" ? a.personNames[0] ?? "Человек" : a.companyName ?? "Компания"
    return `${subject} · ${new Date(a.createdAt).toLocaleDateString("ru-RU")}`
  }

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === templateId),
    [templates, templateId],
  )

  /* People captured by the selected analysis (subject-first for a person analysis). */
  const analysisPeople = useMemo(
    () => (selectedAnalysis ? people.filter((p) => selectedAnalysis.personIds.includes(p.id)) : []),
    [selectedAnalysis, people],
  )

  /* The person the письмо is addressed to: an explicit choice wins, otherwise the
     analysis subject/contact. Injected into the prompt so the письмо is personal. */
  const recipient = selectedPerson ?? analysisPeople[0]

  /* Shared context for both generation and later AI rework. */
  const promptContext: PromptInput = useMemo(() => {
    const promptPeople = selectedPerson ? [selectedPerson] : analysisPeople
    return buildPromptInput(company ?? null, promptPeople, {
      ...(selectedAnalysis?.config ?? {}),
      language,
      guidance,
    })
  }, [company, selectedAnalysis, selectedPerson, analysisPeople, language, guidance])

  function resetOutputs() {
    setOutputs([])
    setBaseIndex(null)
  }

  function onCompanyChange(nextId: string) {
    setCompanyId(nextId)
    resetOutputs()
  }

  function onAnalysisChange(nextId: string) {
    setAnalysisId(nextId)
    resetOutputs()
  }

  function onPersonChange(nextId: string) {
    setPersonId(nextId)
    resetOutputs()
  }

  const task = CONTENT_TYPES.find((t) => t.key === contentType)?.task ?? "Email Outreach"

  async function generate() {
    if (!hasSource) return
    setGenerating(true)
    setError(null)
    setOutputs([])
    setBaseIndex(null)

    const analysisDigest = selectedAnalysis
      ? ANALYSIS_SECTIONS.map((s) => `## ${s.title}\n${selectedAnalysis.result[s.key] ?? ""}`).join("\n\n")
      : ""
    const composedInstructions = [
      instructions.trim(),
      recipient
        ? `[RECIPIENT — обратись лично к этому человеку как к получателю письма]\n${recipient.name}${recipient.role ? `, ${recipient.role}` : ""}`
        : "",
      selectedTemplate
        ? `[TEMPLATE — используй как базовую структуру письма, сохрани его стиль и логику, подставь плейсхолдеры и адаптируй под компанию/человека]\n${selectedTemplate.text}`
        : "",
      analysisDigest ? `[ANALYSIS CONTEXT — build the message on this GTM analysis]\n${analysisDigest}` : "",
    ]
      .filter(Boolean)
      .join("\n\n")

    try {
      /* Fire N independent requests — temperature gives each variant its own voice. */
      const results = await Promise.all(
        Array.from({ length: variantCount }, async () => {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind: "content",
              task,
              input: promptContext,
              instructions: composedInstructions,
              modelId,
            }),
          })
          if (!res.ok) throw new Error("Request failed")
          const data = (await res.json()) as { text: string }
          return data.text
        }),
      )
      setOutputs(results)
      /* A single variant is the obvious base — open the editor straight away. */
      if (results.length === 1) setBaseIndex(0)
    } catch {
      setError("Не удалось сгенерировать письмо. Попробуй ещё раз.")
    } finally {
      setGenerating(false)
    }
  }

  async function saveEmail(text: string) {
    if (!hasSource || !text.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: companyId || undefined,
          personId: personId || undefined,
          analysisId: analysisId || undefined,
          contentType,
          instructions,
          language,
          guidance,
          text,
        }),
      })
      if (!res.ok) throw new Error("Save failed")
      const data = (await res.json()) as { email: { id: string } }
      router.push(`/emails/${data.email.id}`)
      router.refresh()
    } catch {
      setError("Не удалось сохранить письмо. Попробуй ещё раз.")
      setSaving(false)
    }
  }

  if (companies.length === 0 && people.length === 0 && analyses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <p className="text-sm font-medium text-foreground">Пока не на чем писать</p>
        <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
          Письмо строится на компании, анали��е или человеке — можно на любом из них или на всех сразу. Создай хотя бы
          одну сущность, чтобы начать.
        </p>
        <Link
          href="/companies/new"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90"
        >
          <Building2 className="h-4 w-4" aria-hidden="true" />
          Создать компанию
        </Link>
      </div>
    )
  }

  const activeType = CONTENT_TYPES.find((t) => t.key === contentType)

  return (
    <div className="flex flex-col gap-5">
      {/* Source: company / analysis / person — any combination, at least one */}
      <section className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:p-5">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold tracking-tight text-foreground">На основе чего писать</span>
          <p className="text-xs leading-snug text-muted-foreground text-pretty">
            Выбери хотя бы один источник — компанию, анализ или человека. Их можно комбинировать в любом сочетании.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SourceField icon={Building2} title="Компания" active={Boolean(company)}>
            <label htmlFor="email-company" className="sr-only">
              Компания
            </label>
            <select
              id="email-company"
              value={companyId}
              onChange={(e) => onCompanyChange(e.target.value)}
              className={inputClass}
            >
              <option value="">Без компании</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.industry ? ` — ${c.industry}` : ""}
                </option>
              ))}
            </select>
          </SourceField>

          <SourceField icon={LineChart} title="Анализ" active={Boolean(selectedAnalysis)}>
            <label htmlFor="email-analysis" className="sr-only">
              Анализ
            </label>
            <select
              id="email-analysis"
              value={analysisId}
              onChange={(e) => onAnalysisChange(e.target.value)}
              className={inputClass}
              disabled={analyses.length === 0}
            >
              <option value="">{analyses.length === 0 ? "Нет анализов" : "Без анализа"}</option>
              {analyses.map((a) => (
                <option key={a.id} value={a.id}>
                  {analysisLabel(a)}
                </option>
              ))}
            </select>
          </SourceField>

          <SourceField icon={User} title="Человек" active={Boolean(selectedPerson)}>
            <label htmlFor="email-person" className="sr-only">
              Кому
            </label>
            <select
              id="email-person"
              value={personId}
              onChange={(e) => onPersonChange(e.target.value)}
              className={inputClass}
              disabled={people.length === 0}
            >
              <option value="">{people.length === 0 ? "Нет людей" : "Без человека"}</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.role ? ` — ${p.role}` : ""}
                </option>
              ))}
            </select>
          </SourceField>
        </div>

        {!hasSource ? (
          <p className="flex items-center gap-1.5 rounded-lg border border-dashed border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Выбери хотя бы один источник, чтобы сгенерировать письмо.
          </p>
        ) : null}
      </section>

      <ModelSelector value={modelId} onChange={setModelId} />

      {/* Format picker */}
      <section className="flex flex-col gap-2">
        <span className="text-sm font-semibold tracking-tight">Формат</span>
        <div className="flex flex-wrap gap-2">
          {VISIBLE_CONTENT_TYPES.map((type) => {
            const Icon = ICONS[type.key]
            const active = contentType === type.key
            return (
              <button
                key={type.key}
                type="button"
                onClick={() => setContentType(type.key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  active
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {type.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Steering */}
      <section className="flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:p-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email-instructions" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Инструкция для этого письма <span className="font-normal text-muted-foreground">(по желанию)</span>
          </label>
          <AutoTextarea
            id="email-instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="напр. до 120 слов, крючок в первой строке, один чёткий CTA."
            minRows={2}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email-template" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            Шаблон <span className="font-normal text-muted-foreground">(по желанию)</span>
          </label>
          <select
            id="email-template"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className={inputClass}
            disabled={templates.length === 0}
          >
            <option value="">{templates.length === 0 ? "Нет шаблонов" : "Без шаблона"}</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {selectedTemplate ? (
            <p className="line-clamp-3 whitespace-pre-wrap rounded-lg border border-border bg-background px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
              {selectedTemplate.text}
            </p>
          ) : (
            <p className="text-[11px] leading-snug text-muted-foreground">
              AI возьмёт шаблон за основу и адаптирует его под выбранную компанию и человека.
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email-language" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Languages className="h-3.5 w-3.5" aria-hidden="true" />
              Язык
            </label>
            <select
              id="email-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={inputClass}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === "Auto" ? "Авто (по вводу)" : lang}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email-guidance" className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Тон / стиль <span className="font-normal text-muted-foreground">(по желанию)</span>
            </label>
            <input
              id="email-guidance"
              value={guidance}
              onChange={(e) => setGuidance(e.target.value)}
              placeholder="напр. деловой, без хайпа"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Сколько вариантов
          </span>
          <div className="inline-flex rounded-lg border border-border bg-background p-0.5 sm:self-start">
            {VARIANT_COUNTS.map((n) => {
              const active = variantCount === n
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setVariantCount(n)}
                  aria-pressed={active}
                  className={`min-w-9 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              )
            })}
          </div>
          <p className="text-[11px] leading-snug text-muted-foreground">
            AI напишет несколько независимых вариантов — выбери один как основу и доработай его.
          </p>
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={generating || !hasSource}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Пишу…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {outputs.length > 0
                ? "Сгенерировать заново"
                : variantCount > 1
                  ? `Сгенерировать ${variantCount} варианта`
                  : "Сгенерировать письмо"}
            </>
          )}
        </button>
      </section>

      {error ? <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent-foreground">{error}</p> : null}

      {/* Output */}
      {generating && outputs.length === 0 ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Готовлю {activeType?.label.toLowerCase()}…
          {variantCount > 1 ? ` (${variantCount} варианта)` : ""}
        </div>
      ) : outputs.length > 0 && baseIndex === null ? (
        /* Several variants were generated — pick one as the base to refine. */
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Варианты · {outputs.length}
            </span>
            <p className="text-xs leading-snug text-muted-foreground text-pretty">
              Выбери письмо, которое возьмём за основу — дальше его можно вручную поправить или доработать через AI.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {outputs.map((text, i) => (
              <article
                key={i}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Вариант {i + 1}
                  </span>
                  <CopyButton text={text} label="Копировать" />
                </div>
                <div className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-sm">
                  <FormattedText text={text} />
                </div>
                <button
                  type="button"
                  onClick={() => setBaseIndex(i)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
                >
                  <Wand2 className="h-4 w-4" aria-hidden="true" />
                  Взять за основу
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : outputs.length > 0 && baseIndex !== null ? (
        <div className="flex flex-col gap-3">
          {outputs.length > 1 ? (
            <button
              type="button"
              onClick={() => setBaseIndex(null)}
              className="inline-flex items-center gap-1.5 self-start rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Другой вариант ({outputs.length})
            </button>
          ) : null}
          <EmailRefiner
            key={baseIndex}
            baseText={outputs[baseIndex]}
            task={task}
            contentLabel={activeType?.label ?? ""}
            context={promptContext}
            language={language}
            modelId={modelId}
            onSave={saveEmail}
            saving={saving}
            saveLabel="Сохранить письмо"
          />
        </div>
      ) : null}
    </div>
  )
}
