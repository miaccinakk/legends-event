import type { AnalysisStatus } from "@/lib/types"

const styles: Record<AnalysisStatus, string> = {
  Analyzed: "bg-primary/10 text-primary",
  "In Progress": "bg-accent/15 text-accent",
  "Not Started": "bg-muted text-muted-foreground",
}

export function StatusBadge({ status }: { status: AnalysisStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  )
}
