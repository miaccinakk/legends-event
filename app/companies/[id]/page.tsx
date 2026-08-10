import Link from "next/link"
import { notFound } from "next/navigation"
import { LineChart, Mail, Globe, Layers, MapPin, Clock, ArrowUpRight, Plus, Pencil } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { CompanyDetailSections } from "@/components/company-detail-sections"
import { getCompany } from "@/lib/companies-store"
import { analysesByCompany } from "@/lib/analyses-store"
import { emailsByCompany } from "@/lib/emails-store"
import { formatDate } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await getCompany(id)
  if (!company) notFound()

  const [analyses, emails] = await Promise.all([analysesByCompany(id), emailsByCompany(id)])

  return (
    <div className="min-h-dvh">
      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title={company.name}
          backHref="/companies"
          backLabel="К компаниям"
          action={
            <>
              <Link
                href={`/companies/${company.id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted"
              >
                <Pencil className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Редактировать
              </Link>
              <Link
                href={`/analyses/new?companyId=${company.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90"
              >
                <LineChart className="h-4 w-4" aria-hidden="true" />
                Анализ с этой компанией
              </Link>
            </>
          }
        />

        {/* Company facts */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            {company.website ? (
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                {company.website}
              </span>
            ) : null}
            {company.industry ? (
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                {company.industry}
              </span>
            ) : null}
            {company.targetMarket ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                {company.targetMarket}
              </span>
            ) : null}
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDate(company.createdAt)}
            </span>
          </div>
        </section>

        {/* Long-form fields as collapsible sections */}
        <CompanyDetailSections
          productDescription={company.productDescription ?? ""}
          businessGoals={company.businessGoals ?? ""}
          additionalInfo={company.additionalInfo ?? ""}
          links={company.links ?? ""}
        />

        {/* Analyses */}
        <RelatedSection
          title="Анализы"
          emptyText="Ещё нет анализов с этой компанией."
          createHref={`/analyses/new?companyId=${company.id}`}
          createLabel="Создать анализ"
          icon={<LineChart className="h-4 w-4" aria-hidden="true" />}
          items={analyses.map((a) => ({
            id: a.id,
            href: `/analyses/${a.id}`,
            title: a.personNames.length > 0 ? a.personNames.join(", ") : "Анализ без людей",
            meta: formatDate(a.createdAt),
          }))}
        />

        {/* Emails */}
        <RelatedSection
          title="Письма"
          emptyText="Ещё нет писем для этой компании."
          createHref={`/emails/new?companyId=${company.id}`}
          createLabel="Создать письмо"
          icon={<Mail className="h-4 w-4" aria-hidden="true" />}
          items={emails.map((e) => ({
            id: e.id,
            href: `/emails/${e.id}`,
            title: `${e.contentLabel}${e.personName ? ` → ${e.personName}` : ""}`,
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
