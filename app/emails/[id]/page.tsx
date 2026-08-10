import Link from "next/link"
import { notFound } from "next/navigation"
import { Building2, User, LineChart, Clock } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmailDetailEditor } from "@/components/email-detail-editor"
import { getEmail } from "@/lib/emails-store"
import { getCompany } from "@/lib/companies-store"
import { getPerson } from "@/lib/people-store"
import { buildPromptInput, CONTENT_TYPES } from "@/lib/types"
import { formatDate } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function EmailDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const email = await getEmail(id)
  if (!email) notFound()

  const subject = email.companyName || email.personName || "Без компании"

  /* Rebuild the prompt context so AI rework stays grounded in the same lead. */
  const company = email.companyId ? await getCompany(email.companyId) : null
  const person = email.personId ? await getPerson(email.personId) : null
  const context = buildPromptInput(company, person ? [person] : [], {
    language: email.language,
    guidance: email.guidance,
  })
  const task = CONTENT_TYPES.find((t) => t.key === email.contentType)?.task ?? "Email Outreach"

  return (
    <div className="min-h-dvh">
      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader title={`${email.contentLabel}: ${subject}`} backHref="/emails" backLabel="К письмам" />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {email.companyId ? (
            <Link
              href={`/companies/${email.companyId}`}
              className="inline-flex items-center gap-1.5 text-primary transition-colors hover:opacity-80"
            >
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              {email.companyName}
            </Link>
          ) : null}
          {email.personId ? (
            <Link
              href={`/people/${email.personId}`}
              className="inline-flex items-center gap-1.5 text-primary transition-colors hover:opacity-80"
            >
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              {email.personName}
            </Link>
          ) : null}
          {email.analysisId ? (
            <Link
              href={`/analyses/${email.analysisId}`}
              className="inline-flex items-center gap-1.5 text-primary transition-colors hover:opacity-80"
            >
              <LineChart className="h-3.5 w-3.5" aria-hidden="true" />
              На основе анализа
            </Link>
          ) : null}
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(email.createdAt)}
          </span>
          {email.language && email.language !== "Auto" ? (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {email.language}
            </span>
          ) : null}
        </div>

        {email.instructions?.trim() ? (
          <section className="rounded-xl border border-border bg-muted/40 p-4">
            <h2 className="text-xs font-semibold tracking-tight text-foreground">Инструкция при генерации</h2>
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {email.instructions}
            </p>
          </section>
        ) : null}

        <EmailDetailEditor
          id={email.id}
          text={email.text}
          task={task}
          contentLabel={email.contentLabel}
          context={context}
          language={email.language}
        />
      </main>
    </div>
  )
}
