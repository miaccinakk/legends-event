import { TrendingUp, Users, Crosshair, Music } from "lucide-react"

const traits = [
  { icon: TrendingUp, label: "Built", desc: "Backed and built companies from seed to scale." },
  { icon: Users, label: "Transformed", desc: "Moved from corporate structures to creative freedom." },
  { icon: Crosshair, label: "Advises", desc: "PE/VC partners and CEOs on their hardest calls." },
  { icon: Music, label: "Inspired", desc: "Music shapes how he thinks, leads and creates." },
]

const stats = [
  { value: "200+", label: "Companies financed & advised" },
  { value: "100 → 1,000", label: "Scaling board experience" },
  { value: "6,500+", label: "Leaders read Wise Systems" },
]

export function Speaker() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">The speaker</p>

        <div className="mt-8 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Portrait poster */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border">
              <img
                src="/images/julius-bachmann.png"
                alt="Julius Bachmann — VC, CFO, Founder and musician"
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col justify-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Julius Bachmann</h2>
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.22em] text-primary">
              Investor · Operator · Founder · Musician
            </p>

            <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
              Before he became the advisor CEOs call in their hardest moments, Julius sat on the other side of the
              table — first as a PE/VC investor, then as a tech-company CFO. He knows cap tables, boardrooms and the
              pressure of the numbers from the inside. Over more than a decade he has financed and advised{" "}
              <span className="text-foreground">200+ companies</span> through their most consequential calls.
            </p>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              He is also an author and musician. He writes the Wise Systems newsletter — on how we stay human while
              building what matters — read by 6,500+ leaders, and has published essays in Forbes, Sifted, Capital and
              Business Insider. He holds an MBA from London Business School.
            </p>

            <blockquote className="mt-8 border-l-2 border-primary pl-5 text-pretty text-lg italic leading-relaxed text-foreground">
              &ldquo;The highest-leverage decisions are the ones you cannot delegate.&rdquo;
            </blockquote>

            {/* Traits */}
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {traits.map((t) => {
                const Icon = t.icon
                return (
                  <div key={t.label}>
                    <Icon className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-sm font-semibold uppercase tracking-wide">{t.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 divide-y divide-border rounded-2xl border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="px-8 py-8 text-center">
              <p className="gold-text text-3xl font-semibold tracking-tight sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
