export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="rounded-full border border-border bg-card px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        belegends.club
      </span>
      <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl">BeLegends</h1>
      <p className="max-w-md text-pretty text-lg text-muted-foreground">
        Заготовка лендинга. Здесь будет главная страница.
      </p>
    </main>
  )
}
