"use client"

import { fetchOrCreateUser } from "@/lib/actions/user.actions"
import {
  setUserInfo,
  setUserSaved,
  setUserFollowing,
  setUserFollower,
  setUserLikedComments,
} from "@/lib/store/features/user"
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
      const res = await fetchOrCreateUser({ id, imageUrl, username: username || "anonymous" })
      if (res && "_id" in res) {
        dispatch(
          setUserInfo({
            _id: res._id,
            id: res.id,
            username: res.username,
            imageUrl: res.imageUrl,
            firstName: res.firstName,
            lastName: res.lastName,
            about: res.about,
            website: res.website,
          })
        )
        dispatch(setUserSaved(res.saved))
        dispatch(setUserFollowing(res.following))
        dispatch(setUserFollower(res.follower))
        dispatch(setUserLikedComments(res.likedComments))
      } else if (res && "errorMessage" in res) {
        toast.error(res.errorMessage)
      }
    }

    if (isSignedIn) {
      request()
    } else {
      dispatch(setUserInfo(null))
    }
  }, [isSignedIn, user])

  return null
}
