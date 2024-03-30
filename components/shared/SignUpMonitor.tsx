"use client"

import { createUser } from "@/lib/actions/user.actions"
import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"

export default function SignUpMonitor() {
  const { isSignedIn, user } = useUser()
  useEffect(() => {
    if (isSignedIn) {
      const { id, imageUrl, username } = user
      createUser({ id, imageUrl, username: username || "anonymous" })
    }
  }, [isSignedIn])

  return null
}
