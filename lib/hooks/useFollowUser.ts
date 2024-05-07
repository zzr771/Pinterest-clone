import { useMutation } from "@apollo/client"
import { useAppSelector } from "../store/hook"
import { FOLLOW, UNFOLLOW } from "../apolloRequests/user.request"
import { useState } from "react"
import toast from "react-hot-toast"
import showMessageBox from "@/components/shared/showMessageBox"

export default function useFollowUser(isFollowingInitial: boolean) {
  const user = useAppSelector((store) => store.user.user)
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial)
  const [followUserMutation] = useMutation(FOLLOW)
  const [unfollowUserMutation] = useMutation(UNFOLLOW)

  async function followUser(targetUserId: string) {
    if (!user) {
      toast("Please sign in before operation")
      return
    }

    const {
      data: { followUser: res },
    } = await followUserMutation({
      variables: {
        userId: user._id,
        targetUserId,
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
    } else {
      toast.error(res.message)
    }
  }

  async function unfollowUser(targetUserId: string) {
    if (!user) {
      toast("Please sign in before operation")
      return
    }

    const {
      data: { unfollowUser: res },
    } = await unfollowUserMutation({
      variables: {
        userId: user._id,
        targetUserId,
      },
    })
    if (res.success) {
      setIsFollowing(false)
    } else {
      toast.error(res.message)
    }
  }

  return { isFollowing, followUser, unfollowUser }
}
