import { LegendsLogo } from "./legends-logo"

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <LegendsLogo />
        <div className="flex flex-col items-start gap-1 text-sm text-muted-foreground sm:items-end">
          <span className="uppercase tracking-[0.22em]">Access by invitation only</span>
          <a href="https://belegends.club" className="transition-colors hover:text-primary">
            belegends.club
          </a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Legends. The session is recorded for internal use.
        </div>
      </div>
    </footer>
  )
}
