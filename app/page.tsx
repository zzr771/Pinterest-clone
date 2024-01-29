import SearchBar from "@/components/ui/SearchBar"
import { useMemo, useState } from "react"

export default function Home() {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  const handleResize = useMemo(() => {
    let timer = 0
    return function () {
      if (timer) {
        clearTimeout(timer)
      }
      timer = window.setTimeout(() => {
        timer = 0
        if (window.innerWidth <= 820) {
          setIsSmallScreen(true)
        } else {
          setIsSmallScreen(false)
        }
      }, 100)
    }
  }, [])
  document.defaultView?.addEventListener("resize", handleResize)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SearchBar />
    </main>
  )
}
