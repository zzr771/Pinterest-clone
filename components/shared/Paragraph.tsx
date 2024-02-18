"use client"
import { useLayoutEffect, useRef, useState } from "react"

export default function Paragraph({ text, maxLines }: { text: string; maxLines: number }) {
  const pRef = useRef<HTMLParagraphElement>(null)
  const [showMore, setShowMore] = useState(false)
  const [showLess, setShowLess] = useState(false)
  let maxHeight = useRef(0)

  function clickMoreHandler() {
    setShowMore(false)
    setShowLess(true)
    if (pRef.current) {
      pRef.current.style.maxHeight = `1000px`
    }
  }
  function clickLessHandler() {
    setShowMore(true)
    setShowLess(false)
    if (pRef.current) {
      pRef.current.style.maxHeight = maxHeight.current + "px"
    }
  }

  useLayoutEffect(() => {
    const p = pRef.current
    if (!p) return

    const currentHeight = parseInt(getComputedStyle(p).height)
    const lineHeight = parseInt(getComputedStyle(p).getPropertyValue("line-height"))
    maxHeight.current = lineHeight * maxLines
    if (currentHeight > maxHeight.current) {
      p.style.maxHeight = `${lineHeight * maxLines}px`
      setShowMore(true)
    }
  }, [])
  return (
    <div className="relative z-[-1]">
      <p ref={pRef} className="overflow-hidden leading-[1.4]">
        {text}
        {showLess && (
          <span className="font-medium px-1 cursor-pointer" onClick={clickLessHandler}>
            ... less
          </span>
        )}
      </p>
      {showMore && (
        <div
          className="absolute bottom-0 right-0 font-medium bg-white px-1 cursor-pointer"
          onClick={clickMoreHandler}>
          ... more
        </div>
      )}
    </div>
  )
}
