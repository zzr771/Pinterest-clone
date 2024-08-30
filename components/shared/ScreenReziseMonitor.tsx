"use client"

import { useCallback, useMemo } from "react"
import { setScreenSize } from "@/lib/store/features/screenSize"
import { useAppDispatch } from "@/lib/store/hook"

export default function ScreenResize() {
  const dispatch = useAppDispatch()
  const set = useCallback(() => {
    dispatch(setScreenSize(window.innerWidth))
  }, [])
  const handleResize = useMemo(() => {
    let timer = 0
    return function () {
      if (timer) {
        clearTimeout(timer)
      }
      timer = window.setTimeout(() => {
        timer = 0
        set()
      }, 200)
    }
  }, [set])

  if (typeof window === "undefined") return
  set()

  document.defaultView?.addEventListener("resize", handleResize)

  return null
}
