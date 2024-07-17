/*
    When a route is rendered for the first time, it will be cached on the client side for 30s.
  In this 30s, any data or cache changes on the server side can not be reflected on the client
  side, even if refreshing the page, because the router cache takes over.
    This hook is used to invalidate the router cache (when a user refreshes the page) to sync 
  the data on the server and the UI on the client in the first 30s.
*/
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

export default function useInvalidateRouterCache() {
  const initTime = useRef(Date.now())
  const needInvalidate = useRef(false)
  const router = useRouter()

  useEffect(() => {
    return () => {
      const timeDiff = (Date.now() - initTime.current) / 1000

      if (timeDiff < 30 && needInvalidate.current) {
        router.refresh()
      }
    }
  }, [])

  return { needInvalidate }
}
