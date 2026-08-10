"use client"

import { Check, Cpu, Sparkles } from "lucide-react"
import { MODEL_OPTIONS } from "@/lib/models"

const ICONS = [Sparkles, Cpu] as const

interface ModelSelectorProps {
  value: string
  onChange: (id: string) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold tracking-tight">Выбери модель для анализа</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MODEL_OPTIONS.map((option, i) => {
          const Icon = ICONS[i] ?? Cpu
          const active = value === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={active}
              className={`group relative flex items-start gap-4 rounded-xl border p-5 text-left transition-all ${
                active
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-base font-semibold tracking-tight text-foreground">{option.label}</span>
                <span className="text-sm leading-snug text-muted-foreground text-pretty">{option.description}</span>
              </span>
              {active ? (
                <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </section>
  )
}
