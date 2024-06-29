import { useMutation } from "@apollo/client"
import { useAppDispatch, useAppSelector } from "../store/hook"
import { FOLLOW, UNFOLLOW } from "../apolloRequests/user.request"
import toast from "react-hot-toast"
import showMessageBox from "@/components/shared/showMessageBox"
import { usePathname } from "next/navigation"
import { handleApolloRequestError } from "../utils"
import { setUserFollowing } from "../store/features/user"
import { useRef } from "react"

export default function useFollowUser() {
  const dispatch = useAppDispatch()
  const path = useRef(usePathname())
  const user = useAppSelector((store) => store.user.user)
  const [followUserMutation] = useMutation(FOLLOW, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })
  const [unfollowUserMutation] = useMutation(UNFOLLOW, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })

  async function followUser(targetUserId: string) {
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
        path: path.current,
      },
    })

    if (!Array.isArray(res)) return false
    showMessageBox({
      message: "Following",
      button: {
        text: "Undo",
        callback: () => {
          unfollowUser(targetUserId)
        },
      },
    })
    dispatch(setUserFollowing(res))
    return true
  }

  async function unfollowUser(targetUserId: string) {
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
        path: path.current,
      },
    })

    if (!Array.isArray(res)) return false
    dispatch(setUserFollowing(res))
    return true
  }

  return { followUser, unfollowUser }
}
