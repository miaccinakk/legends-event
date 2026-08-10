import { RegistrationForm } from "./registration-form"

const timeChips = [
  { city: "Dubai", time: "5:00 PM" },
  { city: "London", time: "2:00 PM" },
  { city: "New York", time: "9:00 AM" },
]

export function Hero() {
  return (
    <section id="request" className="relative overflow-hidden">
      {/* Atmospheric backdrop */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/lounge-dubai.png"
          alt=""
          className="h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/90" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-20 pt-36 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-40">
        {/* Left: event intro + speaker */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-primary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              InvestHack #03
            </span>
            <span className="text-xs font-light uppercase tracking-[0.22em] text-muted-foreground">
              Private online session
            </span>
          </div>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Ownership, Culture <span className="text-muted-foreground">&amp;</span> Care:
            <br />
            <span className="gold-text">The Capital They Create</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            The rare hour where boardroom strategy and personal leadership meet — from someone who speaks the language of
            investors and understands the human weight of leading.
          </p>

          {/* Speaker line */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-full border border-border">
              <img
                src="/images/julius-bachmann.png"
                alt="Julius Bachmann"
                className="h-full w-full scale-[1.9] object-cover object-[72%_28%]"
              />
            </div>
            <div>
              <p className="font-semibold">Julius Bachmann</p>
              <p className="text-sm tracking-wide text-primary">VC → CFO → Founder</p>
            </div>
          </div>

          {/* Date + times */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm">
              <span className="font-semibold">Tue, 25 August</span>
              <span className="ml-2 text-muted-foreground">· Online</span>
            </span>
            {timeChips.map((t) => (
              <span key={t.city} className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm">
                <span className="font-semibold">{t.time}</span>{" "}
                <span className="text-muted-foreground">{t.city}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right: registration form */}
        <div className="lg:pl-4">
          <RegistrationForm />
        </div>
      </div>
    </section>
  )
}
