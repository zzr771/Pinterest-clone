import { useMemo } from "react"
import { setScreenSize } from "./store/features/screenSizeSlice"
import { useDispatch } from "react-redux"

export default function () {
  if (typeof window === "undefined") return

  const dispatch = useDispatch()

  function set() {
    if (window.innerWidth >= 820) {
      dispatch(setScreenSize(820))
    } else if (window.innerWidth >= 540 && window.innerWidth < 820) {
      dispatch(setScreenSize(768))
    } else {
      dispatch(setScreenSize(540))
    }
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
      }, 100)
    }
  }, [])
  document.defaultView?.addEventListener("resize", handleResize)
}
