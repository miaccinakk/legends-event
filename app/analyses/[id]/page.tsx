import Link from "next/link"
import { notFound } from "next/navigation"
import { Mail, Building2, User, Clock } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { AnalysisResults } from "@/components/analysis-results"
import { getAnalysis } from "@/lib/analyses-store"
import { formatDate } from "@/lib/format"
import type { AnalysisConfig, AnalysisSubject } from "@/lib/types"

export const dynamic = "force-dynamic"

type ConfigFieldKey = Exclude<keyof AnalysisConfig, "subject">

const COMPANY_CONFIG_FIELDS: { key: ConfigFieldKey; label: string }[] = [
  { key: "excludeIndustries", label: "Отрасли не берём" },
  { key: "excludeRegions", label: "Регионы не берём" },
  { key: "excludeSizes", label: "Размеры не берём" },
  { key: "stopFactors", label: "Стоп-факторы" },
  { key: "mustHaveSignals", label: "Обязательные сигналы" },
  { key: "priorityCriteria", label: "Что повышает приоритет" },
  { key: "priorityThreshold", label: "Порог приоритета" },
  { key: "guidance", label: "Инструкция агенту" },
]

const PERSON_CONFIG_FIELDS: { key: ConfigFieldKey; label: string }[] = [
  { key: "personExclusions", label: "Кого не берём / красные флаги" },
  { key: "stopFactors", label: "Стоп-факторы" },
  { key: "personTraits", label: "Ценные качества и сигналы" },
  { key: "priorityCriteria", label: "Что повышает приоритет" },
  { key: "priorityThreshold", label: "Порог приоритета" },
  { key: "guidance", label: "Инструкция агенту" },
]

export default async function AnalysisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const analysis = await getAnalysis(id)
  if (!analysis) notFound()

  const subject: AnalysisSubject = analysis.subject ?? "company"
  const isPerson = subject === "person"
  const configFields = isPerson ? PERSON_CONFIG_FIELDS : COMPANY_CONFIG_FIELDS
  const activeConfig = configFields.filter((f) => analysis.config[f.key]?.trim())

  const title = isPerson
    ? `Анализ человека: ${analysis.personNames[0] ?? "Человек"}`
    : `Анализ: ${analysis.companyName ?? "Компания"}`

  // Person analyses build emails around the person; company analyses around the company.
  const emailHref = isPerson
    ? `/emails/new?${analysis.companyId ? `companyId=${analysis.companyId}&` : ""}personId=${analysis.personIds[0] ?? ""}&analysisId=${analysis.id}`
    : `/emails/new?companyId=${analysis.companyId ?? ""}&analysisId=${analysis.id}`

  return (
    <div className="min-h-dvh">
      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title={title}
          backHref="/analyses"
          backLabel="К анализам"
          action={
            <Link
              href={emailHref}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Письмо на основе анализа
            </Link>
          }
        />

        {/* Subject composition */}
        <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isPerson ? "bg-accent/20 text-accent-foreground" : "bg-primary/10 text-primary"
              }`}
            >
              {isPerson ? (
                <User className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {isPerson ? "Анализ человека" : "Анализ компании"}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDate(analysis.createdAt)}
            </span>
            {analysis.config.language && analysis.config.language !== "Auto" ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {analysis.config.language}
              </span>
            ) : null}
          </div>

          {isPerson ? (
            <div className="flex flex-col gap-2">
              {analysis.personIds[0] ? (
                <Link
                  href={`/people/${analysis.personIds[0]}`}
                  className="inline-flex w-fit items-center gap-1.5 text-primary transition-colors hover:opacity-80"
                >
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                  {analysis.personNames[0] ?? "Человек"}
                </Link>
              ) : null}
              {analysis.companyId ? (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" aria-hidden="true" />В контексте компании{" "}
                  <Link
                    href={`/companies/${analysis.companyId}`}
                    className="text-primary transition-colors hover:opacity-80"
                  >
                    {analysis.companyName ?? "Компания"}
                  </Link>
                </span>
              ) : null}
            </div>
          ) : (
            <>
              {analysis.companyId ? (
                <Link
                  href={`/companies/${analysis.companyId}`}
                  className="inline-flex w-fit items-center gap-1.5 text-primary transition-colors hover:opacity-80"
                >
                  <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {analysis.companyName ?? "Компания"}
                </Link>
              ) : null}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold tracking-tight text-foreground">
                  Люди в лиде ({analysis.personIds.length})
                </span>
                {analysis.personIds.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Анализ собран без людей — только по компании.</p>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {analysis.personIds.map((pid, i) => (
                      <li key={pid}>
                        <Link
                          href={`/people/${pid}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          <User className="h-3 w-3" aria-hidden="true" />
                          {analysis.personNames[i] ?? "Человек"}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>

        {activeConfig.length > 0 ? (
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold tracking-tight">Настройки разбора</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {activeConfig.map((f) => (
                <div key={f.key} className="flex flex-col gap-1">
                  <dt className="text-xs font-semibold tracking-tight text-foreground">{f.label}</dt>
                  <dd className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {analysis.config[f.key]}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold tracking-tight">{isPerson ? "Разбор человека" : "Разбор лида"}</h2>
          <AnalysisResults result={analysis.result} loading={false} subject={subject} />
        </section>
      </main>
    </div>
  )
}
