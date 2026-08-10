export function LegendsMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Heart-diamond mark inspired by the Legends brand */}
      <path
        d="M9 13.5C9 11 11 9 13.5 9c2 0 3.7 1.2 4.5 3l6 12.8L30 12c.8-1.8 2.5-3 4.5-3C37 9 39 11 39 13.5c0 .8-.2 1.6-.6 2.3L26.6 38.4c-1.1 2.1-4.1 2.1-5.2 0L9.6 15.8A5 5 0 0 1 9 13.5Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LegendsLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <LegendsMark className="h-9 w-9 text-primary" />
      <div className="flex flex-col leading-none">
        <span className="text-lg font-semibold tracking-[0.18em] text-foreground">LEGENDS</span>
        {!compact && (
          <span className="mt-1 text-[10px] font-light uppercase tracking-[0.28em] text-muted-foreground">
            AI-Powered Private Network
          </span>
        )}
      </div>
    </div>
  )
}
