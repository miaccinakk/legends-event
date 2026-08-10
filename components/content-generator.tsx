"use client"

import { useState } from "react"
import { Linkedin, Mail, CalendarDays, Twitter, Lightbulb, Loader2, Sparkles, Clapperboard } from "lucide-react"
import { CONTENT_TYPES, type ContentTypeKey, type PromptInput } from "@/lib/types"
import { FormattedText } from "./formatted-text"
import { CopyButton } from "./copy-button"
import { AutoTextarea } from "./auto-textarea"

const ICONS: Record<ContentTypeKey, typeof Linkedin> = {
  linkedin: Linkedin,
  email: Mail,
  event: CalendarDays,
  twitter: Twitter,
  video: Clapperboard,
  ideas: Lightbulb,
}

export function ContentGenerator({ input, modelId }: { input: PromptInput; modelId?: string }) {
  const [activeKey, setActiveKey] = useState<ContentTypeKey | null>(null)
  const [loadingKey, setLoadingKey] = useState<ContentTypeKey | null>(null)
  const [outputs, setOutputs] = useState<Partial<Record<ContentTypeKey, string>>>({})
  const [instructions, setInstructions] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function generate(key: ContentTypeKey, task: string) {
    setActiveKey(key)
    setLoadingKey(key)
    setError(null)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "content", task, input, instructions, modelId }),
      })
      if (!res.ok) throw new Error("Request failed")
      const data = (await res.json()) as { text: string }
      setOutputs((prev) => ({ ...prev, [key]: data.text }))
    } catch {
      setError("Something went wrong generating this content. Please try again.")
    } finally {
      setLoadingKey(null)
    }
  }

  const activeType = CONTENT_TYPES.find((t) => t.key === activeKey)
  const activeOutput = activeKey ? outputs[activeKey] : undefined

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15">
          <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Content Generator</h3>
          <p className="text-xs text-muted-foreground">Turn the analysis into ready-to-send assets.</p>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="content-instructions" className="text-xs font-medium text-muted-foreground">
          Prompt for this generation <span className="text-muted-foreground/60">(optional)</span>
        </label>
        <AutoTextarea
          id="content-instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g. Keep it under 120 words, write in Russian, hook in the first line, one clear CTA."
          minRows={2}
          className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Pick a format below — your prompt is applied to whatever you generate.
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {CONTENT_TYPES.map((type) => {
          const Icon = ICONS[type.key]
          const isLoading = loadingKey === type.key
          const isActive = activeKey === type.key
          return (
            <button
              key={type.key}
              type="button"
              onClick={() => generate(type.key, type.task)}
              disabled={loadingKey !== null}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                isActive
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted"
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Icon className="h-4 w-4" aria-hidden="true" />
              )}
              {type.label}
            </button>
          )
        })}
      </div>

      <div className="mt-4">
        {error ? (
          <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>
        ) : activeType && (activeOutput || loadingKey === activeKey) ? (
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {activeType.label}
              </span>
              {activeOutput ? <CopyButton text={activeOutput} label="Copy" /> : null}
            </div>
            {loadingKey === activeKey && !activeOutput ? (
              <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Writing your {activeType.label.toLowerCase()}…
              </div>
            ) : activeOutput ? (
              <div className="whitespace-pre-wrap">
                <FormattedText text={activeOutput} />
              </div>
            ) : null}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
            Pick a format above to generate content.
          </p>
        )}
      </div>
    </div>
  )
}
