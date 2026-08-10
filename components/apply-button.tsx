"use client"

export const APPLY_EVENT = "legends:open-apply"

export function openApplyModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(APPLY_EVENT))
  }
}

export function ApplyButton({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <button type="button" onClick={openApplyModal} className={className}>
      {children}
    </button>
  )
}
