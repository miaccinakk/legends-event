import { AutoTextarea } from "./auto-textarea"

export const inputClass =
  "w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"

export interface FieldCellProps {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  hint?: string
  type?: "input" | "textarea"
  full?: boolean
  rows?: number
}

export function FieldCell({
  id,
  label,
  value,
  onValueChange,
  placeholder,
  hint,
  type = "input",
  full = false,
  rows = 3,
}: FieldCellProps) {
  return (
    <div
      className={`flex flex-col gap-1.5 rounded-lg border border-border bg-card p-3.5 ${full ? "sm:col-span-2 lg:col-span-3" : ""}`}
    >
      <label htmlFor={id} className="text-[13px] font-semibold tracking-tight text-foreground">
        {label}
      </label>
      {hint ? <p className="-mt-1 text-xs leading-snug text-muted-foreground">{hint}</p> : null}
      {type === "textarea" ? (
        <AutoTextarea
          id={id}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          minRows={rows}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </div>
  )
}
