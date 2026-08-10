import { ArrowRight, ClipboardList, Mail, Users } from "lucide-react"
import { ApplyButton } from "./apply-button"

const assurances = [
  { icon: ClipboardList, label: "Register", desc: "Fill in a short form to request your spot." },
  { icon: Mail, label: "Get your invite", desc: "We'll email you the joining link and details." },
  { icon: Users, label: "Join the room", desc: "A small closed online session, kept intimate." },
]

export function ApplySection() {
  return (
    <section id="apply" className="relative overflow-hidden border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Register</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Reserve your spot at the session
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
            Register below and we&apos;ll send your invite with the joining link. The session is online and the room
            is kept intentionally small, so we recommend signing up early.
          </p>

          <div className="mt-9 flex justify-center">
            <ApplyButton className="group inline-flex items-center gap-2 rounded-full gold-fill px-8 py-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              Apply to Join
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </ApplyButton>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-3">
          {assurances.map((a) => {
            const Icon = a.icon
            return (
              <div key={a.label} className="rounded-2xl border border-border bg-card p-6 text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-sm font-semibold">{a.label}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{a.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
