import { LegendsLogo } from "./legends-logo"

export function SiteNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <LegendsLogo />
        <div className="flex items-center gap-6">
          <span className="hidden text-xs font-light uppercase tracking-[0.25em] text-muted-foreground md:inline">
            Access by invitation only
          </span>
          <a
            href="#request"
            className="rounded-full gold-fill px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Request Access
          </a>
        </div>
      </nav>
    </header>
  )
}
