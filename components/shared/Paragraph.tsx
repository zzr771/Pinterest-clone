"use client"
import { useLayoutEffect, useRef, useState } from "react"

interface Props {
  text?: string
  maxLines: number
  children?: React.ReactNode
  className?: string
}

export default function Paragraph({ text, maxLines, children, className }: Props) {
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
    <div className={`relative ${className}`}>
      <div ref={pRef} className="overflow-hidden">
        {children || text}
        {showLess && (
          <div className="inline-block font-medium px-1 cursor-pointer" onClick={clickLessHandler}>
            ... less
          </div>
        )}
      </div>
      {showMore && (
        <div
          className="absolute bottom-0 right-0 font-medium linear-white pl-2 pr-1 cursor-pointer"
          onClick={clickMoreHandler}>
          ... more
        </div>
      )}
    </div>
  )
}
