"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { LineChart, User, Building2, Users, Clock, ArrowUpRight } from "lucide-react"
import type { Analysis, AnalysisSubject } from "@/lib/types"
import { formatDate } from "@/lib/format"

type Filter = AnalysisSubject | "all"

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "company", label: "Компании" },
  { key: "person", label: "Люди" },
]

export function AnalysesList({ analyses }: { analyses: Analysis[] }) {
  const [filter, setFilter] = useState<Filter>("all")

  const counts = useMemo(
    () => ({
      all: analyses.length,
      company: analyses.filter((a) => (a.subject ?? "company") === "company").length,
      person: analyses.filter((a) => a.subject === "person").length,
    }),
    [analyses],
  )

  const filtered =
    filter === "all" ? analyses : analyses.filter((a) => (a.subject ?? "company") === filter)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
        {FILTERS.map((f) => {
          const active = filter === f.key
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                  active ? "bg-primary/10 text-primary" : "bg-border/60 text-muted-foreground"
                }`}
              >
                {counts[f.key]}
              </span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-foreground">Ничего не найдено</p>
          <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
            В этой категории пока нет анализов.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {filtered.map((a) => {
            const isPerson = a.subject === "person"
            const title = isPerson ? a.personNames[0] ?? "Человек" : a.companyName ?? "Компания"
            const Icon = isPerson ? User : LineChart
            const iconClass = isPerson ? "bg-accent/20 text-accent-foreground" : "bg-primary/10 text-primary"

            return (
              <li key={a.id}>
                <Link
                  href={`/analyses/${a.id}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[15px] font-semibold tracking-tight text-card-foreground">
                          {title}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${iconClass}`}
                        >
                          {isPerson ? "Человек" : "Компания"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {isPerson ? (
                          a.companyName ? (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" aria-hidden="true" />
                              {a.companyName}
                            </span>
                          ) : null
                        ) : a.personNames.length > 0 ? (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" aria-hidden="true" />
                            {a.personNames.join(", ")}
                          </span>
                        ) : null}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {formatDate(a.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
