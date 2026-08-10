"use client"

import { Download } from "lucide-react"

export function PrintButton() {
  return (
    <div className="no-print fixed right-5 top-5 z-50">
      <button
        type="button"
        onClick={() => window.print()}
        className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-lg transition-transform hover:-translate-y-0.5"
        style={{ backgroundColor: "#1a1613", color: "#fbfaf7" }}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Скачать PDF
      </button>
    </div>
  )
}
