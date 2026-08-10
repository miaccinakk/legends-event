"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "./app-sidebar"

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // The login page is a standalone, full-screen layout with no app chrome.
  if (pathname === "/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-dvh lg:pl-64">
      <AppSidebar />
      {children}
    </div>
  )
}
