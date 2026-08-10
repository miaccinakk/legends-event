import { CalendarDays, Video, ArrowRight, TrendingUp, Users, Music, Landmark } from "lucide-react"
import { NetworkBackdrop } from "./network-backdrop"
import { ApplyButton } from "./apply-button"

const timeChips = [
  { city: "Dubai", time: "5:00 PM" },
  { city: "London", time: "2:00 PM" },
  { city: "New York", time: "9:00 AM" },
]

// Credential path shown as a connected infographic (mirrors the speaker's brand mark)
const path = ["VC", "CFO", "Founder"]

const speakerStats = [
  { icon: Landmark, value: "200+", label: "Companies financed & advised" },
  { icon: Users, value: "100 → 1,000", label: "Scaling board experience" },
  { icon: TrendingUp, value: "6,500+", label: "Leaders read Wise Systems" },
]

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Atmospheric backdrop */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/lounge-dubai.png"
          alt=""
          className="h-full w-full object-cover object-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/60 to-background" />
        <NetworkBackdrop className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 lg:pb-28 lg:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Left — event narrative */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-primary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Private online session
              </span>
              <span className="text-xs font-light uppercase tracking-[0.22em] text-muted-foreground">
                Members &amp; approved guests
              </span>
            </div>

            {/* Oversized event mark */}
            <div className="mt-8 flex items-end gap-4">
              <span className="text-[clamp(3.5rem,9vw,7rem)] font-bold leading-[0.85] tracking-tight">
                <span className="gold-text">InvestHack</span>
              </span>
              <span className="gold-fill mb-2 bg-clip-text text-[clamp(3.5rem,9vw,7rem)] font-bold leading-[0.8] tracking-tight text-transparent">
                #03
              </span>
            </div>

            <h1 className="mt-6 max-w-xl text-balance text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl">
              Ownership, Culture <span className="text-muted-foreground">&amp;</span> Care:{" "}
              <span className="text-foreground">The Capital They Create</span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              The rare hour where boardroom strategy and personal leadership meet — a closed session with someone who
              speaks the language of investors and understands the human weight of leading at scale.
            </p>

            {/* Event meta */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-sm backdrop-blur-sm">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="font-semibold">Tue, 25 August</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-sm backdrop-blur-sm">
                <Video className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Online · closed room</span>
              </span>
              {timeChips.map((t) => (
                <span
                  key={t.city}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-sm backdrop-blur-sm"
                >
                  <span className="font-semibold">{t.time}</span>
                  <span className="text-muted-foreground">{t.city}</span>
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ApplyButton className="group inline-flex items-center gap-2 rounded-full gold-fill px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                Apply to Join
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </ApplyButton>
              <a
                href="#speaker"
                className="rounded-full border border-border px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Meet the speaker
              </a>
            </div>
          </div>

          {/* Right — speaker feature (photo + infographic) */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-primary/25 shadow-[0_0_120px_-40px_rgba(197,153,58,0.6)]">
              <img
                src="/images/julius-bachmann.png"
                alt="Julius Bachmann — VC, CFO, Founder and musician"
                className="aspect-[4/5] w-full object-cover object-[64%_16%]"
              />
              {/* readability gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

              {/* Speaker label */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">Hosted by</p>
                <p className="mt-2 text-2xl font-bold leading-[1.05] tracking-tight sm:text-3xl">Julius Bachmann</p>

                {/* Credential path infographic */}
                <div className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  {path.map((role, i) => (
                    <div key={role} className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">{role}</span>
                      {i < path.length - 1 && (
                        <span className="flex items-center gap-1" aria-hidden="true">
                          <span className="h-1 w-1 rounded-full bg-primary" />
                          <span className="h-px w-4 bg-primary/60" />
                          <span className="h-1 w-1 rounded-full bg-primary" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  <span>Investor</span>
                  <span className="text-primary/50">·</span>
                  <span>Operator</span>
                  <span className="text-primary/50">·</span>
                  <span>Founder</span>
                  <span className="text-primary/50">·</span>
                  <span className="inline-flex items-center gap-1 text-primary">
                    <Music className="h-3 w-3" /> Musician
                  </span>
                </div>
              </div>
            </div>

            {/* Stat infographic strip */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {speakerStats.map((s) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-sm"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <p className="gold-text mt-3 text-lg font-bold leading-none tracking-tight">{s.value}</p>
                    <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">{s.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
