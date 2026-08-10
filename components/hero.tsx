import { CalendarDays, Video, ArrowRight } from "lucide-react"
import { NetworkBackdrop } from "./network-backdrop"
import { ApplyButton } from "./apply-button"

const timeChips = [
  { city: "Dubai", time: "5:00 PM" },
  { city: "London", time: "2:00 PM" },
  { city: "New York", time: "9:00 AM" },
]

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Atmospheric backdrop */}
      <div className="absolute inset-0 -z-10">
        <img src="/images/lounge-dubai.png" alt="" className="h-full w-full object-cover object-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/60 to-background" />
        <NetworkBackdrop className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 lg:pb-28 lg:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left — event narrative */}
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="rounded-full border border-primary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Private online session
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <span className="gold-text">InvestHack</span> #03
              </span>
            </div>

            {/* Event title — the headline */}
            <h1 className="mt-7 text-balance text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-[0.98] tracking-tight">
              Ownership, Culture <span className="text-muted-foreground">&amp;</span> Care
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-lg font-light leading-snug text-muted-foreground sm:text-xl">
              The capital they create — a closed session where boardroom strategy and personal leadership meet.
            </p>

            {/* Event meta */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-sm backdrop-blur-sm">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="font-semibold">Tue, 25 August</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-sm backdrop-blur-sm">
                <Video className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Online · closed room</span>
              </span>
            </div>

            {/* City times */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {timeChips.map((t) => (
                <span
                  key={t.city}
                  className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-3.5 py-2 text-sm backdrop-blur-sm"
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

          {/* Right — branded speaker poster (name & credentials baked into the image) */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-primary/25 shadow-[0_0_120px_-40px_rgba(197,153,58,0.6)]">
              <img
                src="/images/julius-bachmann-poster.png"
                alt="Julius Bachmann — VC, CFO, Founder and musician"
                className="aspect-square w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
