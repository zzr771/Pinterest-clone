import CommentCard from "@/components/cards/CommentCard"
import { useEffect, useState } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import { CommentInfo } from "@/lib/types"
import toast from "react-hot-toast"
import { usePathname } from "next/navigation"
import { useMutation } from "@apollo/client"
import { handleApolloRequestError } from "@/lib/utils"
import { LIKE_COMMENT, UNLIKE_COMMENT } from "@/lib/apolloRequests/user.request"
import { useAppDispatch, useAppSelector } from "@/lib/store/hook"
import { setUserLikedComments } from "@/lib/store/features/user"
import useInvalidateRouterCache from "@/lib/hooks/useInvalidateRouterCache"

interface Props {
  comments: CommentInfo[]
  setComments: React.Dispatch<React.SetStateAction<CommentInfo[]>>
}
export default function Comments({ comments, setComments }: Props) {
  const dispatch = useAppDispatch()
  const [isFolded, setIsFolded] = useState(false)
  const path = usePathname()
  const user = useAppSelector((store) => store.user.user)
  const { needInvalidate } = useInvalidateRouterCache()
  const [commentNumber, setCommentNumber] = useState(countComments())

  function countComments() {
    let count = 0
    comments.forEach((item) => {
      count++
      count += item.replies.length
    })
    return count
  }

  useEffect(() => {
    console.log("comments", comments)
    setCommentNumber(countComments())
  }, [comments])

  // --------------------------------------------------------------------------------- Like & Unlike
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
    // storeLikeCount(commentId, 1)
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
    // storeLikeCount(commentId, -1)
    dispatch(setUserLikedComments(res))
    needInvalidate.current = true
    return true
  }

  return (
    <div className="mt-[4rem]">
      <div className="flex items-center justify-between pr-4">
        <h3 className="font-medium my-3">
          {commentNumber > 0 ? `${commentNumber} Comment${commentNumber > 1 ? "s" : ""}` : "No comments yet"}
        </h3>
        {isFolded ? (
          <FaChevronDown
            onClick={() => {
              setIsFolded(false)
            }}
            className="cursor-pointer w-[1.1rem] h-[1.1rem]"
          />
        ) : (
          <FaChevronUp
            onClick={() => {
              setIsFolded(true)
            }}
            className="cursor-pointer w-[1.1rem] h-[1.1rem]"
          />
        )}
      </div>
      {/* max-h-0: prvent the expanded comments from stretching PinContent, which will influence the layout */}
      <div className={`${isFolded ? "hidden" : ""} flex flex-col max-h-0`}>
        {commentNumber > 0 &&
          comments.map((comment) => {
            return (
              comment && (
                <CommentCard
                  key={comment?._id}
                  comment={comment}
                  rootCommentId={comment._id}
                  handleLike={handleLike}
                  handleUnlike={handleUnlike}
                  setComments={setComments}
                />
              )
            )
          })}
        <div className="py-4"></div>
      </div>
    </div>
  )
}
