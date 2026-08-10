"use client"

import { useEffect, useState } from "react"
import {
  BarChart3,
  Users,
  Crosshair,
  MessageSquareQuote,
  TrendingUp,
  Lightbulb,
  Loader2,
  ChevronDown,
  UserCircle,
  Heart,
  Workflow,
  Handshake,
  AlertTriangle,
  Sparkles,
} from "lucide-react"
import { sectionsForSubject, type AnalysisResult, type AnalysisSubject } from "@/lib/types"
import { FormattedText } from "./formatted-text"
import { CopyButton } from "./copy-button"

const ICONS: Record<string, typeof BarChart3> = {
  "market-overview": BarChart3,
  icp: Crosshair,
  audience: Users,
  messaging: MessageSquareQuote,
  "sales-angles": TrendingUp,
  "content-ideas": Lightbulb,
  "person-profile": UserCircle,
  "person-motivations": Heart,
  "person-decision": Workflow,
  "person-approach": Handshake,
  "person-risks": AlertTriangle,
  "person-hooks": Sparkles,
}

interface AnalysisResultsProps {
  result: Partial<AnalysisResult>
  loading: boolean
  subject?: AnalysisSubject
}

function preview(text: string) {
  return text
    .replace(/[#*`>_~-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100)
}

export function AnalysisResults({ result, loading, subject = "company" }: AnalysisResultsProps) {
  const sections = sectionsForSubject(subject)

  // Первая секция открыта по умолчанию, остальные свёрнуты.
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    sections.forEach((s, i) => {
      init[s.key] = i === 0
    })
    return init
  })

  // Во время генерации автоматически раскрываем секции, в которых уже появился текст,
  // чтобы было видно, как разбор наполняется.
  useEffect(() => {
    if (!loading) return
    setOpen((prev) => {
      const next = { ...prev }
      sections.forEach((s) => {
        if (result[s.key]) next[s.key] = true
      })
      return next
    })
  }, [loading, result, sections])

  const allOpen = sections.every((s) => open[s.key])

  function toggleAll() {
    const target = !allOpen
    const next: Record<string, boolean> = {}
    sections.forEach((s) => {
      next[s.key] = target
    })
    setOpen(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <button type="button" onClick={toggleAll} className="btn btn-secondary btn-sm">
          {allOpen ? "Свернуть все" : "Развернуть все"}
        </button>
      </div>

      {sections.map((section, index) => {
        const Icon = ICONS[section.key] ?? BarChart3
        const content = result[section.key]
        const isPending = loading && !content
        const isOpen = Boolean(open[section.key])
        const panelId = `analysis-section-${section.key}`

        return (
          <section
            key={section.key}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpen((prev) => ({ ...prev, [section.key]: !prev[section.key] }))}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-[15px] font-semibold tracking-tight text-card-foreground">
                    <span className="mr-1.5 text-muted-foreground">{index + 1}.</span>
                    {section.title}
                  </span>
                  {!isOpen && content ? (
                    <span className="truncate text-xs text-muted-foreground">{preview(content)}</span>
                  ) : !isOpen ? (
                    <span className="text-xs text-muted-foreground">
                      {isPending ? "Генерируется…" : "Нажмите, чтобы раскрыть"}
                    </span>
                  ) : null}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
                ) : null}
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </div>
            </button>

            {isOpen ? (
              <div id={panelId} className="border-t border-border px-5 py-4">
                {isPending ? (
                  <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Анализируем…
                  </div>
                ) : content ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-end">
                      <CopyButton text={content} />
                    </div>
                    <FormattedText text={content} />
                  </div>
                ) : (
                  <p className="py-4 text-sm text-muted-foreground">Ожидает генерации.</p>
                )}
              </div>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}
