import { LegendsLogo } from "./legends-logo"
import { ApplyButton } from "./apply-button"

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-transparent bg-background/70 backdrop-blur-md transition-colors">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <LegendsLogo className="h-8" />
        <div className="flex items-center gap-6">
          <ApplyButton className="rounded-full gold-fill px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            Apply to Join
          </ApplyButton>
        </div>
      </nav>
    </header>
  )
}
