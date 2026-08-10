import Link from "next/link"
import { Building2, Plus, Globe, Layers, Clock, ArrowUpRight } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DeleteButton } from "@/components/delete-button"
import { readCompanies } from "@/lib/companies-store"
import { formatDate } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function CompaniesPage() {
  const companies = await readCompanies()

  return (
    <div className="min-h-dvh">
      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <PageHeader
          title="Компании"
          subtitle="Карточки компаний: сайт, отрасль, продукт и особенности. В анализе к ним подключаются люди."
          action={
            <Link
              href="/companies/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Новая компания
            </Link>
          }
        />

        {companies.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-medium text-foreground">Пока нет ни одной компании</p>
            <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
              Создай компанию — а в анализе объединишь её с нужными людьми.
            </p>
            <Link
              href="/companies/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Создать компанию
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {companies.map((company) => (
              <li
                key={company.id}
                className="group flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <Link
                  href={`/companies/${company.id}`}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="truncate text-[15px] font-semibold tracking-tight text-card-foreground">
                      {company.name}
                    </span>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {company.website ? (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" aria-hidden="true" />
                          {company.website}
                        </span>
                      ) : null}
                      {company.industry ? (
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" aria-hidden="true" />
                          {company.industry}
                        </span>
                      ) : null}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {formatDate(company.createdAt)}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
                <DeleteButton
                  endpoint={`/api/companies/${company.id}`}
                  itemLabel={`компанию «${company.name}»`}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
