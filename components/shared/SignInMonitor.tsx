"use client"

import { createUser } from "@/lib/actions/user.actions"
import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function SignInMonitor() {
  const { isSignedIn, user } = useUser()
  useEffect(() => {
    if (isSignedIn) {
      const { id, imageUrl, username } = user
      createUser({ id, imageUrl, username: username || "anonymous" }).then((res) => {
        if (res?.errorMessage) {
          toast.error(res.errorMessage)
        }
      })
    }
  }, [isSignedIn])

  return null
}
