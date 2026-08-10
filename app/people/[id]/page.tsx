import Link from "next/link"
import { notFound } from "next/navigation"
import { LineChart, Mail, Globe, Briefcase, Clock, ArrowUpRight, Plus, Pencil, LinkIcon } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { PersonDetailSections } from "@/components/person-detail-sections"
import { getPerson } from "@/lib/people-store"
import { analysesByPerson } from "@/lib/analyses-store"
import { emailsByPerson } from "@/lib/emails-store"
import { formatDate } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function PersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const person = await getPerson(id)
  if (!person) notFound()

  const [analyses, emails] = await Promise.all([analysesByPerson(id), emailsByPerson(id)])
  const socialLinks = person.links
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

  return (
    <div className="min-h-dvh">
      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title={person.name}
          backHref="/people"
          backLabel="К людям"
          action={
            <>
              <Link
                href={`/people/${person.id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted"
              >
                <Pencil className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Редактировать
              </Link>
              <Link
                href={`/analyses/new?personId=${person.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90"
              >
                <LineChart className="h-4 w-4" aria-hidden="true" />
                Анализ с этим человеком
              </Link>
            </>
          }
        />

        {/* Person facts */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            {person.role ? (
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                {person.role}
              </span>
            ) : null}
            {person.website ? (
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                {person.website}
              </span>
            ) : null}
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDate(person.createdAt)}
            </span>
          </div>

          {socialLinks.length > 0 ? (
            <div className="mt-4 flex flex-col gap-1">
              <span className="text-xs font-semibold tracking-tight text-foreground">Соцсети</span>
              <ul className="flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <li key={link}>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
                      <LinkIcon className="h-3 w-3" aria-hidden="true" />
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        {/* Long-form fields as collapsible sections */}
        <PersonDetailSections
          bio={person.bio ?? ""}
          experience={person.experience ?? ""}
          education={person.education ?? ""}
          additionalInfo={person.additionalInfo ?? ""}
        />

        {/* Analyses */}
        <RelatedSection
          title="Анализы"
          emptyText="Ещё нет анализов с этим человеком."
          createHref={`/analyses/new?personId=${person.id}`}
          createLabel="Создать анализ"
          icon={<LineChart className="h-4 w-4" aria-hidden="true" />}
          items={analyses.map((a) => ({
            id: a.id,
            href: `/analyses/${a.id}`,
            title: a.subject === "person" ? (a.personNames[0] ?? "Человек") : (a.companyName ?? "Компания"),
            meta: formatDate(a.createdAt),
          }))}
        />

        {/* Emails */}
        <RelatedSection
          title="Письма"
          emptyText="Ещё нет писем для этого человека."
          createHref={`/emails/new?personId=${person.id}`}
          createLabel="Создать письмо"
          icon={<Mail className="h-4 w-4" aria-hidden="true" />}
          items={emails.map((e) => ({
            id: e.id,
            href: `/emails/${e.id}`,
            title: `${e.contentLabel} — ${e.companyName || person.name}`,
            meta: formatDate(e.createdAt),
          }))}
        />
      </main>
    </div>
  )
}

function RelatedSection({
  title,
  emptyText,
  createHref,
  createLabel,
  icon,
  items,
}: {
  title: string
  emptyText: string
  createHref: string
  createLabel: string
  icon: React.ReactNode
  items: { id: string; href: string; title: string; meta: string }[]
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>
          {title}
          <span className="rounded-full bg-border/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {items.length}
          </span>
        </h2>
        <Link href={createHref} className="btn btn-secondary btn-sm">
          <Plus className="h-4 w-4 text-primary" aria-hidden="true" />
          {createLabel}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-6 text-center text-sm text-muted-foreground">
          {emptyText}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-[15px] font-medium text-card-foreground">{item.title}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {item.meta}
                  </span>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
