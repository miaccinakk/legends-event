import { Landmark, Network, Sparkles, Music2, Compass } from "lucide-react"

const pillars = [
  { icon: Landmark, label: "Capital" },
  { icon: Network, label: "Connections" },
  { icon: Sparkles, label: "Experiences" },
  { icon: Music2, label: "Culture" },
  { icon: Compass, label: "Impact" },
]

const stats = [
  { value: "1,300+", label: "Matchmakings in GCC" },
  { value: "80+", label: "Private gatherings" },
  { value: "30+", label: "Countries represented" },
]

export function AboutLegends() {
  return (
    <section className="relative overflow-hidden border-t border-border py-24">
      <div className="absolute inset-0 -z-10">
        <img src="/images/lounge-network.png" alt="" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">About Legends</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            The AI-powered private network behind what&apos;s next.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Legends puts the most active cross-border founders, CEOs and investors in one room — to swap what works and
            back each other when things get rough. Sessions like this InvestHack are the way in. Membership opens by
            invitation, to those who take part.
          </p>
        </div>

        {/* Pillars */}
        <div className="mt-12 flex flex-wrap gap-3">
          {pillars.map((p) => {
            const Icon = p.icon
            return (
              <span
                key={p.label}
                className="flex items-center gap-2.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm"
              >
                <Icon className="h-4 w-4 text-primary" />
                <span className="uppercase tracking-[0.15em]">{p.label}</span>
              </span>
            )
          })}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-card px-8 py-8">
              <p className="gold-text text-3xl font-semibold tracking-tight sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-16 flex flex-col items-start gap-6 rounded-2xl border border-primary/30 bg-card p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h3 className="text-balance text-2xl font-semibold tracking-tight">Sessions like this are the way in.</h3>
            <p className="mt-2 text-pretty text-muted-foreground">
              Seats are capped and reviewed personally. The final list locks 24 hours before.
            </p>
          </div>
          <a
            href="#request"
            className="shrink-0 rounded-full gold-fill px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Request Access
          </a>
        </div>
      </div>
    </section>
  )
}
