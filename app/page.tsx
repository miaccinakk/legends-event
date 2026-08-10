import Link from "next/link"
import { Building2, Users, LineChart, Mail } from "lucide-react"
import { DashboardFeed } from "@/components/dashboard-feed"
import { readCompanies } from "@/lib/companies-store"
import { readPeople } from "@/lib/people-store"
import { readAnalyses } from "@/lib/analyses-store"
import { readEmails } from "@/lib/emails-store"

export const dynamic = "force-dynamic"

const QUICK_ACTIONS = [
  { href: "/companies/new", label: "Новая компания", icon: Building2 },
  { href: "/people/new", label: "Новый человек", icon: Users },
  { href: "/analyses/new", label: "Новый анализ", icon: LineChart },
  { href: "/emails/new", label: "Новое письмо", icon: Mail },
]

export default async function HomePage() {
  const [companies, people, analyses, emails] = await Promise.all([
    readCompanies(),
    readPeople(),
    readAnalyses(),
    readEmails(),
  ])

  return (
    <div className="min-h-dvh">
      <main className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-balance">Дашборд</h1>
            <p className="text-[15px] text-muted-foreground text-pretty">
              Компании, люди, их анализ и письма — всё в одном месте.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon
              return (
                <Link
                  key={a.href}
                  href={a.href}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-[15px] font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted"
                >
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  {a.label}
                </Link>
              )
            })}
          </div>
        </section>

        <DashboardFeed companies={companies} people={people} analyses={analyses} emails={emails} />
      </main>
    </div>
  )
}
