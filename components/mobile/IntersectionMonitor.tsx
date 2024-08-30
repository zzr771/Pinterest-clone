// this component monitors the screen scrolling position to control whether to hide or show some special components
"use client"
import { useEffect, useRef } from "react"
import { setIntersectionState } from "@/lib/store/features/intersection"
import { useAppDispatch } from "@/lib/store/hook"

interface Props {
  name: "OptionButtonMobile" | "NavBarBottom"
}
export default function IntersectionMonitor({ name }: Props) {
  const dispatch = useAppDispatch()
  const monitorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.innerWidth >= 820) return

    const intersectionObserver = new IntersectionObserver((entries) => {
      const screenHeight = window.innerHeight
      const top = entries[0].boundingClientRect.top
      const bottom = screenHeight - top

      // "top > bottom" means the monitorRef enters and leaves the screen from the bottom side
      if (top > bottom) {
        // if enter the screen (screen scrolls downward)
        if (bottom >= 0) {
          dispatch(setIntersectionState({ name, event: "enter-bottom" }))
        }
        // if leave the screen (screen scrolls upward)
        else {
          dispatch(setIntersectionState({ name, event: "leave-bottom" }))
        }
      }
      // if monitorRef enters and leaves the screen from the top side
      else {
        if (top < 0) {
          dispatch(setIntersectionState({ name, event: "leave-top" }))
        } else {
          dispatch(setIntersectionState({ name, event: "enter-top" }))
        }
      }
    })

    if (monitorRef.current) {
      intersectionObserver.observe(monitorRef.current as Element)
    }

    return () => {
      intersectionObserver.disconnect()
    }
  }, [name])

  // this component is designed to work on mobile devices
  if (window.innerWidth >= 820) return null

  return <div ref={monitorRef} className=""></div>
}
