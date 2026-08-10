import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { SessionValue } from "@/components/session-value"
import { Speaker } from "@/components/speaker"
import { AboutLegends } from "@/components/about-legends"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <SiteNav />
      <main>
        <Hero />
        <SessionValue />
        <Speaker />
        <AboutLegends />
      </main>
      <SiteFooter />
    </div>
  )
}
