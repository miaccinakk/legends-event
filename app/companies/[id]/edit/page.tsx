import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { CompanyForm } from "@/components/company-form"
import { getCompany } from "@/lib/companies-store"
import type { CompanyInput } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await getCompany(id)
  if (!company) notFound()

  const initial: CompanyInput = {
    name: company.name,
    website: company.website,
    industry: company.industry,
    targetMarket: company.targetMarket,
    productDescription: company.productDescription,
    businessGoals: company.businessGoals,
    additionalInfo: company.additionalInfo,
    links: company.links,
  }

  return (
    <div className="min-h-dvh">
      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <PageHeader
          title="Редактировать компанию"
          subtitle="Измени данные компании. Уже созданные анализы и письма не меняются."
          backHref={`/companies/${company.id}`}
          backLabel="К компании"
        />
        <CompanyForm companyId={company.id} initial={initial} />
      </main>
    </div>
  )
}
