import { useMutation } from "@apollo/client"
import { useAppSelector } from "../store/hook"
import { FOLLOW, UNFOLLOW } from "../apolloRequests/user.request"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import showMessageBox from "@/components/shared/showMessageBox"
import { usePathname } from "next/navigation"

export default function useFollowUser(isFollowingInitial: boolean) {
  const path = usePathname()
  const user = useAppSelector((store) => store.user.user)
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial)
  const [followUserMutation] = useMutation(FOLLOW)
  const [unfollowUserMutation] = useMutation(UNFOLLOW)

  useEffect(() => {
    if (isFollowingInitial) {
      setIsFollowing(isFollowingInitial)
    }
  }, [isFollowingInitial])

  async function followUser(targetUserId: string): Promise<boolean> {
    if (!user) {
      toast("Please sign in before operation")
      return false
    }

    const {
      data: { followUser: res },
    } = await followUserMutation({
      variables: {
        userId: user._id,
        targetUserId,
        path,
      },
    })

    if (res.success) {
      showMessageBox({
        message: "Following",
        button: {
          text: "Undo",
          callback: () => {
            unfollowUser(targetUserId)
          },
        },
      })
      setIsFollowing(true)
      return true // operation succeeded
    } else {
      toast.error(res.message)
      return false // operation failed
    }
  }

  async function unfollowUser(targetUserId: string): Promise<boolean> {
    if (!user) {
      toast("Please sign in before operation")
      return false
    }

    const {
      data: { unfollowUser: res },
    } = await unfollowUserMutation({
      variables: {
        userId: user._id,
        targetUserId,
        path,
      },
    })

    if (res.success) {
      setIsFollowing(false)
      return true // operation succeeded
    } else {
      toast.error(res.message)
      return false // operation failed
    }
  }

  return { isFollowing, followUser, unfollowUser }
}
