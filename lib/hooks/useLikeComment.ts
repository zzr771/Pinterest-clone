import { useMutation } from "@apollo/client"
import { LIKE_COMMENT, UNLIKE_COMMENT } from "../apolloRequests/user.request"
import { handleApolloRequestError } from "../utils"
import { useAppDispatch, useAppSelector } from "../store/hook"
import { setUserLikedComments } from "@/lib/store/features/user"
import toast from "react-hot-toast"
import { usePathname } from "next/navigation"
import useInvalidateRouterCache from "./useInvalidateRouterCache"

export default function useLikeComment() {
  const user = useAppSelector((store) => store.user.user)
  const path = usePathname()
  const dispatch = useAppDispatch()
  const { needInvalidate } = useInvalidateRouterCache()

  const [likeCommentMutation] = useMutation(LIKE_COMMENT, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })
  const [unlikeCommentMutation] = useMutation(UNLIKE_COMMENT, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })

  async function handleLike(commentId: string) {
    if (!user) {
      toast("Please sign in before operation")
      return false
    }

    const {
      data: { likeComment: res },
    } = await likeCommentMutation({
      variables: {
        userId: user._id,
        commentId,
        path,
      },
    })

    if (!Array.isArray(res)) return false
    dispatch(setUserLikedComments(res))
    needInvalidate.current = true
    return true
  }
  async function handleUnlike(commentId: string) {
    if (!user) {
      toast("Please sign in before operation")
      return false
    }

    const {
      data: { unlikeComment: res },
    } = await unlikeCommentMutation({
      variables: {
        userId: user._id,
        commentId,
        path,
      },
    })

    if (!Array.isArray(res)) return false
    dispatch(setUserLikedComments(res))
    needInvalidate.current = true
    return true
  }

  return {
    handleLike,
    handleUnlike,
  }
}
