import { PageHeader } from "@/components/page-header"
import { AnalysisCreator } from "@/components/analysis-creator"
import { readCompanies } from "@/lib/companies-store"
import { readPeople } from "@/lib/people-store"

export const dynamic = "force-dynamic"

export default async function NewAnalysisPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string; personId?: string }>
}) {
  const [{ companyId, personId }, companies, people] = await Promise.all([
    searchParams,
    readCompanies(),
    readPeople(),
  ])

  return (
    <div className="min-h-dvh">
      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <PageHeader
          title="Новый анализ"
          subtitle="Выбери компанию и людей, настрой исключения, приоритеты и агента — разбор соберётся из лида."
          backHref="/analyses"
          backLabel="К анализам"
        />
        <AnalysisCreator
          companies={companies}
          people={people}
          preselectedCompanyId={companyId}
          preselectedPersonId={personId}
        />
      </main>
    </div>
  )
}
