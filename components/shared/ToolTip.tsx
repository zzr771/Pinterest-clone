"use client"
import { useLayoutEffect, useRef } from "react"

interface Props {
  position?: "top" | "left" | "right" | "bottom"
  text: string
  children: React.ReactNode
  extraGap?: number
}

export default function ToolTip({ position = "bottom", text, children, extraGap = 0 }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const box = boxRef.current
    const container = containerRef.current

    if (!box || !container) return
    const { width, height } = box.getBoundingClientRect()
    const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect()

    switch (position) {
      case "top":
        box.classList.add("horizontal-middle")
        box.style.bottom = height + 8 + extraGap + "px"
        break
      case "bottom":
        box.classList.add("horizontal-middle")
        box.style.top = containerHeight + 8 + extraGap + "px"
        break
      case "left":
        box.classList.add("vertical-middle")
        box.style.left = -width - 8 - extraGap + "px"
        break
      case "right":
        if (!container) return
        box.classList.add("vertical-middle")
        box.style.left = containerWidth + 8 + extraGap + "px"
        break
    }
  })
  return (
    <div ref={containerRef} className="relative hover-visible-container">
      <div
        ref={boxRef}
        className="absolute p-2 text-xs bg-black rounded-lg text-white whitespace-nowrap hover-content-visible"
        data-test="tooltip">
        {text}
      </div>
      {children}
    </div>
  )
}
