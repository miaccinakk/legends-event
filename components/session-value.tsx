import { Compass, Brain, DoorClosed, Check, X } from "lucide-react"

const agenda = [
  {
    icon: Compass,
    step: "01",
    title: "The Reflective Operator's Playbook",
    desc: "Why your highest-leverage decisions can't be delegated, what relational responsibility looks like in practice, and how the best CEOs stay human while scaling from 100 to 1,000 people.",
  },
  {
    icon: Brain,
    step: "02",
    title: "The Hacks",
    desc: "The personal plays behind better decisions, sharper focus and sustainable high performance — plus the mistakes he's watched founders repeat along the way.",
  },
  {
    icon: DoorClosed,
    step: "03",
    title: "The Closed Room",
    desc: "Legends members only. A small-group conversation with Julius straight after the talk — real questions, direct answers, and intros with the speaker.",
  },
]

const forYou = [
  "Founders and CEOs carrying decisions they can't delegate",
  "Operators scaling teams and cultures through real pressure",
  "Investors and board members who lead both people and capital",
]

const notForYou = ["Anyone looking to pitch the speaker on the call", "Service providers and fund marketers working the room"]

export function SessionValue() {
  return (
    <section className="border-t border-border bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Why this room</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            The decisions that move a company are rarely the financial ones.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            The way you lead 20 people won&apos;t work with 100 — and what gets you to 100 won&apos;t get you to 1,000.
            In one focused session, Julius unpacks what changes when the founder becomes the bottleneck, and how care
            creates energy in an organisation instead of draining it.
          </p>
        </div>

        {/* Agenda */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {agenda.map((a) => {
            const Icon = a.icon
            return (
              <div
                key={a.step}
                className="flex flex-col rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs tracking-widest text-muted-foreground">{a.step}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold">{a.title}</h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Who it's for / not for */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8">
            <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Who it&apos;s for</h3>
            <ul className="mt-5 flex flex-col gap-4">
              {forYou.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-pretty leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-background p-8">
            <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Not for</h3>
            <ul className="mt-5 flex flex-col gap-4">
              {notForYou.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <span className="text-pretty leading-relaxed text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
