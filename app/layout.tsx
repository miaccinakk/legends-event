import type React from "react"
import type { Metadata, Viewport } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "InvestHack #03 — Julius Bachmann · Legends",
  description:
    "Ownership, Culture and Care: The Capital They Create. A private online session with Julius Bachmann — VC, CFO, Founder. By invitation only. Tuesday, 25 August · online.",
  openGraph: {
    title: "InvestHack #03 — Julius Bachmann · Legends",
    description:
      "Ownership, Culture and Care: The Capital They Create. A private online session with Julius Bachmann. By invitation only.",
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`bg-background ${outfit.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
