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
        <div className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left — event narrative */}
          <div className="relative z-10">
            {/* Kicker: private session + InvestHack identity + online tag */}
            <span className="block text-xs font-medium uppercase tracking-[0.2em] text-primary">Private session</span>

            <div className="mt-3">
              <p className="text-[1.75rem] font-extrabold tracking-tight sm:text-4xl">
                <span className="gold-text">InvestHack</span> #02
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                <Video className="h-4 w-4 text-primary" />
                Online · closed room
              </span>
            </div>

            {/* Event title — the headline */}
            <h1 className="mt-6 text-balance text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-[0.98] tracking-tight">
              Ownership, Culture <span className="text-muted-foreground">&amp;</span> Care
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-lg font-light leading-snug text-muted-foreground sm:text-xl">
              The capital they create — a closed session where boardroom strategy and personal leadership meet.
            </p>

            {/* Event date + city times */}
            <div className="mt-9 flex flex-col gap-4">
              <div className="inline-flex items-center gap-3">
                <CalendarDays className="h-8 w-8 shrink-0 text-primary sm:h-9 sm:w-9" />
                <span className="text-3xl font-bold tracking-tight sm:text-4xl">Tuesday, 25 August</span>
              </div>

              <div className="flex flex-wrap items-center divide-x divide-border/70">
                {timeChips.map((t) => (
                  <div key={t.city} className="flex flex-col px-4 first:pl-0">
                    <span className="text-lg font-semibold leading-none">{t.time}</span>
                    <span className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{t.city}</span>
                  </div>
                ))}
              </div>
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

          {/* Right — speaker portrait. On mobile it sits behind the text block, faded and masked so copy stays readable. On desktop it becomes a prominent side portrait. */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.45] [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_75%,transparent)] lg:pointer-events-auto lg:relative lg:inset-auto lg:opacity-100 lg:min-h-[560px] lg:[mask-image:none]">
            <img
              src="/images/julius-bachmann.png"
              alt="Julius Bachmann — VC, CFO, Founder and musician"
              className="absolute left-1/2 top-1/2 h-[115%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain lg:h-auto lg:w-[128%] lg:left-0 lg:-translate-x-[22%]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
