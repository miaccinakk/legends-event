"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Users,
  LineChart,
  Mail,
  FileText,
  ChevronRight,
  Plus,
  List,
  LogOut,
  Menu,
  X,
} from "lucide-react"

type NavChild = { href: string; label: string; icon: typeof List }

type NavItem = {
  key: string
  label: string
  icon: typeof LayoutDashboard
  href?: string
  exact?: boolean
  children?: NavChild[]
}

const NAV: NavItem[] = [
  { key: "dashboard", label: "Дашборд", icon: LayoutDashboard, href: "/", exact: true },
  {
    key: "companies",
    label: "Компании",
    icon: Building2,
    href: "/companies",
    children: [
      { href: "/companies", label: "Все компании", icon: List },
      { href: "/companies/new", label: "Новая компания", icon: Plus },
    ],
  },
  {
    key: "people",
    label: "Люди",
    icon: Users,
    href: "/people",
    children: [
      { href: "/people", label: "Все люди", icon: List },
      { href: "/people/new", label: "Новый человек", icon: Plus },
    ],
  },
  {
    key: "analyses",
    label: "Анализы",
    icon: LineChart,
    href: "/analyses",
    children: [
      { href: "/analyses", label: "Все анализы", icon: List },
      { href: "/analyses/new", label: "Новый анализ", icon: Plus },
    ],
  },
  {
    key: "emails",
    label: "Письма",
    icon: Mail,
    href: "/emails",
    children: [
      { href: "/emails", label: "Все письма", icon: List },
      { href: "/emails/new", label: "Новое письмо", icon: Plus },
    ],
  },
  {
    key: "templates",
    label: "Шаблоны",
    icon: FileText,
    href: "/templates",
    children: [
      { href: "/templates", label: "Все шаблоны", icon: List },
      { href: "/templates/new", label: "Новый шаблон", icon: Plus },
    ],
  },
]

function sectionMatchesPath(item: NavItem, pathname: string) {
  if (!item.href) return false
  if (item.href === "/") return pathname === "/"
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

function childIsActive(href: string, pathname: string) {
  // "new" pages are an exact match; list pages match themselves and detail routes,
  // but not the dedicated /new route.
  if (href.endsWith("/new")) return pathname === href
  if (pathname === href) return true
  return pathname.startsWith(`${href}/`) && !pathname.endsWith("/new")
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const initiallyOpen = NAV.filter((i) => i.children && sectionMatchesPath(i, pathname)).map((i) => i.key)
  const [open, setOpen] = useState<string[]>(initiallyOpen)

  function toggle(key: string) {
    setOpen((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  async function logout() {
    setLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.replace("/login")
      router.refresh()
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight">Nexus Opener</span>
          <span className="text-[11px] text-muted-foreground">Outreach workspace</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon
            const sectionActive = sectionMatchesPath(item, pathname)

            // Plain link (no children) — e.g. Dashboard
            if (!item.children) {
              const active = item.exact ? pathname === item.href : sectionActive
              return (
                <li key={item.key}>
                  <Link
                    href={item.href ?? "/"}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              )
            }

            const isOpen = open.includes(item.key)
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => toggle(item.key)}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    sectionActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${sectionActive ? "text-primary" : ""}`}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen ? (
                  <ul className="mt-1 flex flex-col gap-0.5 border-l border-border pl-3 ml-4">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon
                      const active = childIsActive(child.href, pathname)
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onNavigate}
                            aria-current={active ? "page" : undefined}
                            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                              active
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <ChildIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            {child.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          {loggingOut ? "Выходим…" : "Выйти"}
        </button>
      </div>
    </div>
  )
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-card lg:block">
        <SidebarNav />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Открыть меню"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-dark">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Nexus Opener</span>
        </span>
      </div>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-border bg-card shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Закрыть меню"
              className="absolute right-3 top-4 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  )
}
