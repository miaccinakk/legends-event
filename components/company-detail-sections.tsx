"use client"

import { useState } from "react"
import { ChevronDown, Package, Target, Info, LinkIcon } from "lucide-react"

interface DetailSection {
  key: "productDescription" | "businessGoals" | "additionalInfo" | "links"
  title: string
  description: string
  icon: React.ReactNode
  value: string
}

/**
 * Renders the company's long-form fields as a set of collapsible accordion
 * sections — mirroring the edit form's layout — so a long profile is broken
 * into digestible blocks instead of a dense two-column wall of text.
 */
export function CompanyDetailSections({
  productDescription,
  businessGoals,
  additionalInfo,
  links,
}: {
  productDescription: string
  businessGoals: string
  additionalInfo: string
  links: string
}) {
  const all: DetailSection[] = [
    {
      key: "productDescription",
      title: "Что продаём / характеристики",
      description: "Продукт, оффер, ключевые свойства",
      icon: <Package className="h-4 w-4" aria-hidden="true" />,
      value: productDescription,
    },
    {
      key: "businessGoals",
      title: "Цель / бизнес-задачи",
      description: "Чего хотим достичь, метрики",
      icon: <Target className="h-4 w-4" aria-hidden="true" />,
      value: businessGoals,
    },
    {
      key: "additionalInfo",
      title: "Доп. информация",
      description: "Контекст, ограничения, тон",
      icon: <Info className="h-4 w-4" aria-hidden="true" />,
      value: additionalInfo,
    },
    {
      key: "links",
      title: "Ссылки",
      description: "Сайт, соцсети, материалы",
      icon: <LinkIcon className="h-4 w-4" aria-hidden="true" />,
      value: links,
    },
  ]

  // Only show sections that actually carry content.
  const sections = all.filter((s) => s.value.trim().length > 0)

  // First section open by default so there's always something visible.
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((s, i) => [s.key, i === 0])),
  )

  if (sections.length === 0) return null

  function toggle(key: string) {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex flex-col gap-3">
      {sections.map((s) => {
        const isOpen = open[s.key]
        const bodyId = `company-detail-${s.key}`
        return (
          <section key={s.key} className="overflow-hidden rounded-xl border border-border bg-card">
            <button
              type="button"
              onClick={() => toggle(s.key)}
              aria-expanded={isOpen}
              aria-controls={bodyId}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/40"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {s.icon}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-[15px] font-semibold tracking-tight text-foreground">{s.title}</span>
                  <span className="truncate text-xs text-muted-foreground">{s.description}</span>
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {isOpen ? (
              <div id={bodyId} className="border-t border-border px-4 py-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{s.value}</p>
              </div>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}
