import Link from "next/link"
import { Mail, Plus, Clock, ArrowUpRight } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DeleteButton } from "@/components/delete-button"
import { readEmails } from "@/lib/emails-store"
import { formatDate } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function EmailsPage() {
  const emails = await readEmails()

  return (
    <div className="min-h-dvh">
      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <PageHeader
          title="Письма"
          subtitle="Готовый outreach-контент — на основе компании и, по желанию, человека и анализа."
          action={
            <Link
              href="/emails/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Новое письмо
            </Link>
          }
        />

        {emails.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-medium text-foreground">Пока нет писем</p>
            <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
              Выбери компанию (и при желании человека и анализ) — соберём письмо под нужный формат.
            </p>
            <Link
              href="/emails/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Создать письмо
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {emails.map((e) => (
              <li
                key={e.id}
                className="group flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <Link href={`/emails/${e.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[15px] font-semibold tracking-tight text-card-foreground">
                        {e.companyName || e.personName || "Без компании"}
                        {e.companyName && e.personName ? ` · ${e.personName}` : ""}
                      </span>
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {e.contentLabel}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {formatDate(e.createdAt)}
                    </span>
                  </div>
                  <ArrowUpRight
                    className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
                <DeleteButton
                  endpoint={`/api/emails/${e.id}`}
                  itemLabel={`письмо «${e.companyName || e.personName || "без компании"}»`}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
