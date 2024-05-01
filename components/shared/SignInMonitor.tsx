"use client"

import { createUserIfNeeded } from "@/lib/actions/user.actions"
import { storeUserInfo } from "@/lib/store/features/user"
import { useAppDispatch } from "@/lib/store/hook"
import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function SignInMonitor() {
  const { isSignedIn, user } = useUser()
  const dispatch = useAppDispatch()

  useEffect(() => {
    async function request() {
      if (!isSignedIn) return

      const { id, imageUrl, username } = user
      const res = await createUserIfNeeded({ id, imageUrl, username: username || "anonymous" })
      if (res && "id" in res) {
        dispatch(storeUserInfo(res))
      } else if (res && "errorMessage" in res) {
        toast.error(res.errorMessage)
      }
    }

    if (isSignedIn) {
      request()
    } else {
      dispatch(storeUserInfo(null))
    }
  }, [isSignedIn])

  return null
}
