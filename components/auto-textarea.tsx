"use client"

import { useLayoutEffect, useRef } from "react"

export interface AutoTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Minimum number of rows the textarea should never shrink below. */
  minRows?: number
}

/**
 * Textarea that grows with its content as you type, with a sensible minimum
 * height and manual vertical resize still available. Removes the "tiny box"
 * problem where long content is stuck inside a cramped, fixed-height field.
 */
export function AutoTextarea({ minRows = 3, className = "", value, onChange, ...rest }: AutoTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  function resize(el: HTMLTextAreaElement) {
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  // Resize on mount and whenever the controlled value changes (e.g. reset, prefill).
  useLayoutEffect(() => {
    if (ref.current) resize(ref.current)
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => {
        resize(e.currentTarget)
        onChange?.(e)
      }}
      rows={minRows}
      className={`resize-y overflow-hidden ${className}`}
      {...rest}
    />
  )
}
