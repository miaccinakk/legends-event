import type React from "react";
import {
  ArrowUpRight,
  Sparkles,
  Send,
  Mail,
  Phone,
  Linkedin,
  Globe,
} from "lucide-react";

// Ссылка на живой прототип (Railway).
const PROTOTYPE_URL = "https://nexushub-ai-production.up.railway.app";
const PROTOTYPE_LABEL = "nexushub-ai-production.up.railway.app";

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] font-medium uppercase tracking-[0.18em]"
      style={{ color: "var(--muted)" }}
    >
      {children}
    </p>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-5">
      <Kicker>{kicker}</Kicker>
      <h2
        className="mt-1.5 font-serif text-2xl leading-tight"
        style={{ color: "var(--ink)" }}
      >
        {title}
      </h2>
    </div>
  );
}

function Automation({
  title,
  task,
  solution,
  output,
}: {
  title: string;
  task: string;
  solution: string;
  output: string;
}) {
  const rows: [string, string][] = [
    ["Задача", task],
    ["Решение", solution],
    ["Output", output],
  ];
  return (
    <div
      className="doc-break-avoid border-t pt-5"
      style={{ borderColor: "var(--hairline)" }}
    >
      <h3 className="font-serif text-lg" style={{ color: "var(--ink)" }}>
        {title}
      </h3>
      <dl className="mt-3 grid gap-2 text-sm leading-relaxed">
        {rows.map(([term, desc]) => (
          <div key={term} className="flex gap-3">
            <dt
              className="w-20 shrink-0 text-[11px] font-medium uppercase tracking-[0.12em]"
              style={{ color: "var(--muted)" }}
            >
              {term}
            </dt>
            <dd style={{ color: "var(--ink-soft)" }}>{desc}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function PortfolioItem({
  name,
  url,
  label,
  stack,
  description,
}: {
  name: string;
  url: string;
  label: string;
  stack: string;
  description: string;
}) {
  return (
    <div
      className="doc-break-avoid border-b py-4 first:border-t"
      style={{ borderColor: "var(--hairline)" }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-serif text-lg" style={{ color: "var(--ink)" }}>
          {name}
        </h3>
        <a
          href={url}
          className="doc-link text-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
        </a>
      </div>
      <p
        className="mt-1 text-sm leading-relaxed"
        style={{ color: "var(--ink-soft)" }}
      >
        {description}
      </p>
      <p className="mt-1.5 text-xs" style={{ color: "var(--muted)" }}>
        {stack}
      </p>
    </div>
  );
}

function PlanPhase({
  step,
  title,
  note,
  points,
}: {
  step: string;
  title: string;
  note?: string;
  points: string[];
}) {
  return (
    <div
      className="doc-break-avoid flex gap-5 border-t pt-5"
      style={{ borderColor: "var(--hairline)" }}
    >
      <div className="w-8 shrink-0">
        <span className="font-serif text-xl" style={{ color: "var(--accent)" }}>
          {step}
        </span>
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="font-serif text-base" style={{ color: "var(--ink)" }}>
            {title}
          </h3>
          {note ? (
            <span
              className="text-[11px] font-medium uppercase tracking-[0.12em]"
              style={{ color: "var(--muted)" }}
            >
              {note}
            </span>
          ) : null}
        </div>
        <ul
          className="mt-2 grid gap-1.5 text-sm leading-relaxed"
          style={{ color: "var(--ink-soft)" }}
        >
          {points.map((p) => (
            <li key={p} className="flex gap-2.5">
              <span aria-hidden="true" style={{ color: "var(--muted)" }}>
                —
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ApplicationDocument() {
  return (
    <div className="app-doc min-h-screen w-full px-4 py-10 font-sans">
      <article
        className="doc-sheet rounded-2xl border px-8 py-10 sm:px-14 sm:py-16"
        style={{
          borderColor: "#fff",
          boxShadow: "0 0px 0px 0px #fff",
        }}
      >
        {/* Header */}
        <header className="doc-break-avoid">
          <div className="mt-3 flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1
                className="font-serif text-4xl leading-none"
                style={{ color: "var(--ink)" }}
              >
                Руслан Мотин
              </h1>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}></p>
            </div>
            <ul
              className="grid gap-1.5 text-sm"
              style={{ color: "var(--ink-soft)" }}
            >
              <li className="flex items-center gap-2">
                <Send
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--muted)" }}
                  aria-hidden="true"
                />
                <span>@monkrizi</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--muted)" }}
                  aria-hidden="true"
                />
                <span>monkriz1991@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--muted)" }}
                  aria-hidden="true"
                />
                <span>+375 29 896-60-76</span>
              </li>
              <li className="flex items-center gap-2">
                <Linkedin
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--muted)" }}
                  aria-hidden="true"
                />
                <a
                  href="https://www.linkedin.com/in/ruslan-motsin-407086271/"
                  className="doc-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  in/ruslan-motsin
                </a>
              </li>
            </ul>
          </div>
        </header>

        {/* Hero — Live prototype */}
        <section
          className="doc-break-avoid mt-10 overflow-hidden rounded-2xl"
          style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
        >
          <div className="px-7 py-8 sm:px-10 sm:py-10">
            <div className="flex items-center gap-2">
              <Sparkles
                className="h-4 w-4"
                style={{ color: "#d9ad63" }}
                aria-hidden="true"
              />
              <span
                className="text-[11px] font-medium uppercase tracking-[0.18em]"
                style={{ color: "#d9ad63" }}
              >
                Живой прототип
              </span>
            </div>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-balance">
              NexusHub AI — рабочий прототип анализ компании + content-фабрики
            </h2>
            <p
              className="mt-3 max-w-2xl text-sm leading-relaxed"
              style={{ color: "#c9c9cf" }}
            >
              Небольшой, но полностью рабочий пример того, что можно построить
              для автоматизации процессов. Заполните данные по кампании →
              система проанализирует её и даст краткую выжимку → по клику на
              нужную кнопку готовит контент (сейчас — посты) на нужном языке.
              Это ядро, вокруг которого дальше можно масштабировать и усложнять
              CRM.
            </p>

            <a
              href={PROTOTYPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 rounded-full px-6 py-3 text-base font-semibold transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: "#d9ad63", color: "#18181b" }}
            >
              Открыть прототип
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </a>
            <p className="mt-3 text-sm" style={{ color: "#d9ad63" }}>
              {PROTOTYPE_LABEL}
            </p>

            <div
              className="mt-6 border-t pt-4 text-sm leading-relaxed"
              style={{
                borderColor: "rgba(255,255,255,0.14)",
                color: "#c9c9cf",
              }}
            >
              <span className="font-medium" style={{ color: "var(--paper)" }}>
                Куда это масштабируется:{" "}
              </span>
              подключение AI-моделей для video/image-генерации, автопостинг по
              каналам, персонализация под спикера и — на перспективу —
              внутренняя LLM.
            </div>
          </div>
        </section>

        {/* Positioning */}
        <section className="doc-break-avoid mt-12">
          <SectionTitle kicker="" title="" />
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--ink-soft)" }}
          >
            Уже более 6 лет работаю на стыке интернет-маркетинга, веб-разработки
            и автоматизации бизнес-процессов напрямую с компаниями: помогаю
            запускать и развивать цифровые продукты, создавать сайты и
            внутренние системы, оптимизировать процессы и подбирать инструменты
            под конкретные задачи бизнеса.
            <br />
            <br />
            За это время я работал с разными направлениями: электротехника,
            сантехника, двери, CRM-системы, образовательные продукты,
            онлайн-сервисы и другие проекты. Такой опыт позволяет мне быстро
            погружаться в новую сферу, понимать продукт, находить узкие места и
            предлагать решения, которые дают практический результат.
            <br />
            <br />
            Техническая часть для меня является инструментом решения задач: я
            могу самостоятельно собрать необходимый веб-сервис, автоматизацию,
            интеграцию или внутренний инструмент, а также разобраться с уже
            существующими системами и технологиями.
            <br />
            <br />
            В AI-направлении я использую тот же подход: выбираю инструменты
            исходя из задачи — где нужно ускорить создание контента, где
            автоматизировать рутину, а где собрать удобный процесс для команды.
            <br />
            <br />
            Прототип NexusHub AI выше — пример такого подхода: небольшой рабочий
            инструмент, который объединяет данные о компаниях, AI-анализ и
            генерацию материалов в одном процессе. Подобные решения можно
            постепенно развивать под конкретные бизнес-задачи.
          </p>
        </section>

        {/* AI stack + automations */}
        <section className="mt-12">
          <SectionTitle
            kicker="AI-стек и автоматизации"
            title="Инструменты и рабочие примеры"
          />

          <p
            className="mb-6 text-sm leading-relaxed"
            style={{ color: "var(--ink-soft)" }}
          >
            <span className="font-medium" style={{ color: "var(--ink)" }}>
              Руками:{" "}
            </span>
            OpenAI GPT-модели / ChatGPT для анализа, ресёрча и генерации
            контента, AI-генераторы изображений, Cursor / V0 для разработки.{" "}
            <br />
            <span className="font-medium" style={{ color: "var(--ink)" }}>
              В системы подключаю:{" "}
            </span>
            AI-интеграции через API: OpenAI, Gemini и другие модели. Разработка
            промптов, настройка AI-процессов и автоматизация задач вокруг
            генерации текста, анализа данных и создания контента.
          </p>

          <div className="grid gap-5">
            <Automation
              title="AI4Car — AI-платформа для диагностики автомобилей"
              task="Автоматизация процесса первичной диагностики: от получения данных об ошибках автомобиля до понятного объяснения проблемы для обычного пользователя."
              solution="Реализован AI Helper с интеграцией диагностики: сканирование ошибок, обработка кодов неисправностей, генерация объяснений и рекомендаций. Добавлены пользовательские сценарии взаимодействия с AI и автоматизированная обработка запросов."
              output="Получился полноценный AI-инструмент, который переводит сложные технические данные в понятные рекомендации для водителя и может масштабироваться под дополнительные сценарии автосервиса."
            />
            <Automation
              title="Автодор — развитие внутренней CRM-платформы"
              task="Обновить и масштабировать существующую внутреннюю систему, которая использовалась для рабочих процессов компании."
              solution="Система была полностью переработана на новом стеке: обновлена архитектура, логика работы и взаимодействие с данными. В процессе развития прорабатывались возможности внедрения AI-помощников для работы с внутренней информацией."
              output="Получилась более гибкая и масштабируемая платформа, которую можно дальше развивать под новые задачи бизнеса и автоматизацию."
            />
            <Automation
              title="NexusHub AI — пайплайн «анализ компании → контент» (этот прототип)"
              task="Убрать ручной ресёрч и написание постов под каждую компанию."
              solution="Ввод данных о компании → анализ → генерация постов через OpenAI с выбором языка. Далее можно заложить возможность подключать разные AI-модели."
              output="Готовый пост за секунды вместо часа ручной работы; от ввода до результата — без участия человека."
            />
          </div>
        </section>

        {/* Portfolio */}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <section className="mt-12">
          <SectionTitle kicker="" title="Портфолио" />
          <div>
            <PortfolioItem
              name="AI4Car"
              url="https://ai4car.app/"
              label="ai4car.app"
              stack="React · React Native · Node.js · PostgreSQL · REST API"
              description="AI-платформа диагностики авто: полный цикл frontend/backend, AI-функционал, автономный биллинг, admin-панель. Роль: Fullstack."
            />
            <PortfolioItem
              name="Автодор (Росавтодор)"
              url="https://newnto.rosavtodor.ru/"
              label="newnto.rosavtodor.ru"
              stack="Nuxt 3 · REST API · PostgreSQL"
              description="Платформа поиска и аналитики отраслевой документации: сложные фильтры, внутренняя CRM с генерацией документов, Data Mapper. Роль: Frontend + internal tools."
            />
            <PortfolioItem
              name="Profiterm"
              url="https://profiterm.by/"
              label="profiterm.by"
              stack="Nuxt 3 · Node.js · MongoDB · REST API"
              description="Корпоративный сайт под ключ: адаптивный UI, backend, система заявок, SEO и production-деплой. Роль: Fullstack."
            />
            <PortfolioItem
              name="Полное портфолио"
              url="https://ctrlcat.my/"
              label="ctrlcat.my"
              stack="Некоторые проекты и кейсы"
              description="Витрина работ и кейсов с контекстом по каждому проекту."
            />
          </div>
        </section>

        {/* Plan — new page in print */}
        <section className="doc-page-break mt-12">
          <SectionTitle
            kicker="План на первый месяц в Legends"
            title="Сначала разобраться, потом строить"
          />

          <p
            className="mb-7 max-w-2xl text-sm leading-relaxed"
            style={{ color: "var(--ink-soft)" }}
          >
            Я не берусь сразу всё переделывать — так делать неправильно. Сначала
            смотрю, что уже есть и как это работает, и только потом намечаю
            roadmap. Сделать всё сразу невозможно, поэтому глобальный план можно
            обозначить, но начинаю с первоочередного.
          </p>

          <div className="grid gap-0">
            <PlanPhase
              step="1"
              title="Оценка того, что есть"
              note="Старт"
              points={[
                "Разбираюсь, как устроена работа компании: детали, нюансы, кто за что отвечает.",
                "Смотрю, какие инструменты и каналы уже используются и что из этого работает.",
                "Даю честную оценку текущего состояния — сильные места и где теряется время.",
              ]}
            />
            <PlanPhase
              step="2"
              title="Первоначальный roadmap"
              note="На базе оценки"
              points={[
                "Обозначаю глобальный roadmap, но фокус — на первоочередных, реально нужных бизнесу задачах.",
                "Первая часть: то, что нужно бизнесу сейчас — генерация контента, инструменты, чтобы всё это можно было поддерживать, и аналитика.",
                "Приоритеты расставляю по факту, а не заранее из головы — после того как разберусь в п.1.",
              ]}
            />
            <PlanPhase
              step="3"
              title="Разработка и улучшение инструментов"
              note="~1 месяц"
              points={[
                "Вторая, более глубокая часть roadmap: разработка новых и улучшение уже имеющихся инструментов.",
                "Ориентировочно это занимает около месяца — от простого рабочего варианта к более удобному.",
                "Всё, что делаю, оформляю как повторяемый процесс, а не разовое действие.",
              ]}
            />
            <PlanPhase
              step="4"
              title="Постоянная доработка"
              note="Дальше"
              points={[
                "Дальше — постоянно смотрю на инструменты, улучшаю их и качество результата.",
                "Ориентируюсь на реальные метрики каналов и на то, сколько работает без моего участия.",
              ]}
            />
          </div>
        </section>

        {/* Footer */}
        <footer
          className="doc-break-avoid mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6"
          style={{ borderColor: "var(--hairline)" }}
        >
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--ink-soft)" }}
          ></div>
          <div
            className="flex flex-wrap items-center gap-4 text-sm"
            style={{ color: "var(--ink-soft)" }}
          >
            <span>Telegram @monkrizi</span>
            <span>monkriz1991@gmail.com</span>
          </div>
        </footer>
      </article>
    </div>
  );
}
