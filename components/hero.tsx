import { CalendarDays, Clock, Video } from "lucide-react"
import { NetworkBackdrop } from "./network-backdrop"

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
        <img
          src="/images/lounge-dubai.png"
          alt=""
          className="h-full w-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/55 to-background" />
        <NetworkBackdrop className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-36 lg:pb-32 lg:pt-44">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-primary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            InvestHack #03
          </span>
          <span className="text-xs font-light uppercase tracking-[0.22em] text-muted-foreground">
            Private online session · Members &amp; approved guests
          </span>
        </div>

        <h1 className="mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
          Ownership, Culture <span className="text-muted-foreground">&amp;</span> Care:
          <br />
          <span className="gold-text">The Capital They Create</span>
        </h1>

        <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
          The rare hour where boardroom strategy and personal leadership meet — a closed session with someone who
          speaks the language of investors and understands the human weight of leading at scale.
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
          {timeChips.map((t) => (
            <span
              key={t.city}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-sm backdrop-blur-sm"
            >
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-semibold">{t.time}</span>
              <span className="text-muted-foreground">{t.city}</span>
            </span>
          ))}
        </div>

        {/* Speaker teaser */}
        <div className="mt-12 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-primary/40">
              <img
                src="/images/julius-bachmann.png"
                alt="Julius Bachmann"
                className="h-full w-full scale-[1.6] object-cover object-[70%_22%]"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Hosted by</p>
              <p className="mt-1 text-lg font-semibold">Julius Bachmann</p>
              <p className="text-sm tracking-wide text-primary">VC → CFO → Founder · Investor. Operator. Musician.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#apply"
              className="rounded-full gold-fill px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Apply to Join
            </a>
            <a
              href="#speaker"
              className="rounded-full border border-border px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Meet the speaker
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
