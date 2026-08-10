import { PageHeader } from "@/components/page-header"
import { PersonForm } from "@/components/person-form"

export default function NewPersonPage() {
  return (
    <div className="min-h-dvh">
      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <PageHeader
          title="Новый человек"
          subtitle="Заполни карточку человека. В анализе ты подключишь его к нужной компании."
          backHref="/people"
          backLabel="К людям"
        />
        <PersonForm />
      </main>
    </div>
  )
}
