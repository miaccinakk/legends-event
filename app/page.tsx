const sections = [
  {
    tag: "01",
    title: "Hero",
    desc: "Главный экран: заголовок, подзаголовок и призыв к действию.",
  },
  {
    tag: "02",
    title: "Видео",
    desc: "Блок с промо-видео или встроенным плеером.",
  },
  {
    tag: "03",
    title: "О проекте",
    desc: "Короткое описание, что такое BeLegends и для кого.",
  },
  {
    tag: "04",
    title: "Возможности",
    desc: "Ключевые фичи или преимущества в виде карточек.",
  },
  {
    tag: "05",
    title: "Отзывы",
    desc: "Социальное доказательство: цитаты, логотипы, цифры.",
  },
  {
    tag: "06",
    title: "Контакты",
    desc: "Форма заявки, ссылки и подвал сайта.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      {/* Nav */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="font-mono text-sm font-semibold tracking-tight">BeLegends</span>
        <span className="rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
          belegends.club
        </span>
      </header>

      {/* Hero zone */}
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-20 text-center">
        <span className="rounded-full border border-border bg-card px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Заготовка лендинга
        </span>
        <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl">BeLegends</h1>
        <p className="max-w-md text-pretty text-lg text-muted-foreground">
          Это стартовый каркас будущей главной страницы. Ниже размечены основные зоны, которые предстоит наполнить
          контентом.
        </p>
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
            Смотреть видео
          </span>
          <span className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium">Подробнее</span>
        </div>
      </section>

      {/* Zone placeholders */}
      <section className="mx-auto grid max-w-5xl gap-4 px-6 pb-24 sm:grid-cols-2">
        {sections.map((s) => (
          <div
            key={s.tag}
            className="flex min-h-40 flex-col rounded-xl border border-dashed border-border bg-card p-6"
          >
            <span className="font-mono text-xs text-muted-foreground">{s.tag}</span>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">{s.title}</h2>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} BeLegends</span>
          <span className="font-mono">belegends.club</span>
        </div>
      </footer>
    </div>
  )
}
