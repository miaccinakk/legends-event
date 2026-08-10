import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { PersonForm } from "@/components/person-form"
import { getPerson } from "@/lib/people-store"
import type { PersonInput } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const person = await getPerson(id)
  if (!person) notFound()

  const initial: PersonInput = {
    name: person.name,
    role: person.role,
    website: person.website,
    links: person.links,
    bio: person.bio,
    experience: person.experience ?? "",
    education: person.education ?? "",
    additionalInfo: person.additionalInfo,
  }

  return (
    <div className="min-h-dvh">
      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <PageHeader
          title="Редактировать человека"
          subtitle="Измени карточку человека. Уже созданные анализы и письма не меняются."
          backHref={`/people/${person.id}`}
          backLabel="К человеку"
        />
        <PersonForm personId={person.id} initial={initial} />
      </main>
    </div>
  )
}
