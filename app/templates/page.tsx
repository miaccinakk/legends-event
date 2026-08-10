import Link from "next/link"
import { FileText, Plus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { TemplateList } from "@/components/template-list"
import { readTemplates } from "@/lib/templates-store"

export const dynamic = "force-dynamic"

export default async function TemplatesPage() {
  const templates = await readTemplates()

  return (
    <div className="min-h-dvh">
      <main className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <PageHeader
          title="Шаблоны"
          subtitle="Сохранённые текстовые шаблоны писем. Выбирай их при создании письма — AI адаптирует шаблон под компанию и человека."
          action={
            <Link
              href="/templates/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Новый шаблон
            </Link>
          }
        />

        {templates.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-medium text-foreground">Пока нет ни одного шаблона</p>
            <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
              Создай шаблон — и он появится в списке выбора при создании письма.
            </p>
            <Link
              href="/templates/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Создать шаблон
            </Link>
          </div>
        ) : (
          <TemplateList templates={templates} />
        )}
      </main>
    </div>
  )
}
