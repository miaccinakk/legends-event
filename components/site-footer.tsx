import { LegendsLogo } from "./legends-logo"

const legalLinks = [
  { label: "Privacy", href: "https://belegends.club/privacy" },
  { label: "Terms", href: "https://belegends.club/terms" },
  { label: "Codex", href: "https://belegends.club/codex" },
  { label: "Honor", href: "https://belegends.club/honor" },
]

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
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-start justify-between gap-4 px-6 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Legends. The session is recorded for internal use.</span>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 uppercase tracking-[0.14em]">
            {legalLinks.map((link) => (
              <a key={link.label} href={link.href} className="transition-colors hover:text-primary">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
