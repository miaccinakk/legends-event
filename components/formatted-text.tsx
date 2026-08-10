/**
 * Renders plain AI text with light formatting:
 * - lines starting with "-" or "•" become bullet items
 * - blank lines separate paragraphs
 */
export function FormattedText({ text }: { text: string }) {
  const lines = text.split("\n")
  const blocks: { type: "bullet" | "para"; content: string }[] = []

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (/^[-•]\s+/.test(line)) {
      blocks.push({ type: "bullet", content: line.replace(/^[-•]\s+/, "") })
    } else {
      blocks.push({ type: "para", content: line })
    }
  }

  const elements: React.ReactNode[] = []
  let i = 0
  while (i < blocks.length) {
    if (blocks[i].type === "bullet") {
      const items: string[] = []
      while (i < blocks.length && blocks[i].type === "bullet") {
        items.push(blocks[i].content)
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="flex list-none flex-col gap-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-sm leading-relaxed text-card-foreground">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>,
      )
    } else {
      elements.push(
        <p key={`p-${i}`} className="text-sm leading-relaxed text-card-foreground">
          {blocks[i].content}
        </p>,
      )
      i++
    }
  }

  return <div className="flex flex-col gap-3">{elements}</div>
}
