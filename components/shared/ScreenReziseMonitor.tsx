"use client"

import { useMemo } from "react"
import { setScreenSize } from "@/lib/store/features/screenSizeSlice"
import { useAppDispatch } from "@/lib/store/hook"

export default function ScreenResize() {
  if (typeof window === "undefined") return

  const dispatch = useAppDispatch()

  function set() {
    dispatch(setScreenSize(window.innerWidth))
  }
  set()

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
  }, [])
  document.defaultView?.addEventListener("resize", handleResize)

  return null
}
