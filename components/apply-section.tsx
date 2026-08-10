import { RegistrationForm } from "./registration-form"

export function ApplySection() {
  return (
    <section id="apply" className="relative overflow-hidden border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">Apply to join</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Request your seat at the session
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
            Tell us about yourself — we&apos;ll review and be in touch. Seats are capped and the room is kept
            intentionally small. A submission isn&apos;t a seat: every application is reviewed personally within 72
            hours.
          </p>
        </div>

        <div className="mt-12">
          <RegistrationForm />
        </div>
      </div>
    </section>
  )
}
