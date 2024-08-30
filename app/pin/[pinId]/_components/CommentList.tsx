import CommentCard from "@/components/cards/CommentCard"
import { useCallback, useEffect, useState } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import { CommentInfo } from "@/lib/types"
import useLikeComment from "@/lib/hooks/useLikeComment"

interface Props {
  comments: CommentInfo[]
  setComments: React.Dispatch<React.SetStateAction<CommentInfo[]>>
}
export default function Comments({ comments, setComments }: Props) {
  const [isFolded, setIsFolded] = useState(false)

  // --------------------------------------------------------------------------------- Comment Number
  const countComments = useCallback(() => {
    let count = 0
    comments.forEach((item) => {
      count++
      count += item.replies.length
    })
    return count
  }, [comments])
  const [commentNumber, setCommentNumber] = useState(countComments())
  useEffect(() => {
    setCommentNumber(countComments())
  }, [comments, countComments])

  // --------------------------------------------------------------------------------- Like & Unlike
  const { handleLike, handleUnlike } = useLikeComment()

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
        {commentNumber === 0 && (
          <span className="text-gray-font-4 font-light text-base">
            No comments yet! Add one to start the conversation.
          </span>
        )}
        <div className="py-10"></div>
      </div>
    </div>
  )
}
