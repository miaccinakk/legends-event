import { PageHeader } from "@/components/page-header"
import { EmailCreator } from "@/components/email-creator"
import { readCompanies } from "@/lib/companies-store"
import { readPeople } from "@/lib/people-store"
import { readAnalyses } from "@/lib/analyses-store"
import { readTemplates } from "@/lib/templates-store"

export const dynamic = "force-dynamic"

export default async function NewEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string; analysisId?: string }>
}) {
  const [{ companyId, analysisId }, companies, people, analyses, templates] = await Promise.all([
    searchParams,
    readCompanies(),
    readPeople(),
    readAnalyses(),
    readTemplates(),
  ])

  return (
    <div className="min-h-dvh">
      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <PageHeader
          title="Новое письмо"
          subtitle="Выбери компанию и, при желании, анализ и человека. Дальше — формат, инструкции и генерация."
          backHref="/emails"
          backLabel="К письмам"
        />
        <EmailCreator
          companies={companies}
          people={people}
          analyses={analyses}
          templates={templates}
          preselectedCompanyId={companyId}
          preselectedAnalysisId={analysisId}
        />
      </main>
    </div>
  )
}
