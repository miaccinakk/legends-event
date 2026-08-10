import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  subtitle?: string
  /** Optional "back" link shown above the title. */
  backHref?: string
  backLabel?: string
  /** Optional action node (button/link) rendered to the right of the title. */
  action?: ReactNode
}

export function PageHeader({ title, subtitle, backHref, backLabel = "Назад", action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-balance">{title}</h1>
          {subtitle ? <p className="text-base text-muted-foreground text-pretty">{subtitle}</p> : null}
        </div>
        {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
      </div>
    </div>
  )
}
