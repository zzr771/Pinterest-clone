import CommentCard from "@/components/cards/CommentCard"
import InputModal from "@/components/mobile/InputModal"
import useLikeComment from "@/lib/hooks/useLikeComment"
import { CommentInfo } from "@/lib/types"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { IoMdClose } from "react-icons/io"

interface Props {
  setshowCommentsMobile: React.Dispatch<React.SetStateAction<boolean>>
  comments: CommentInfo[]
  setComments: React.Dispatch<React.SetStateAction<CommentInfo[]>>
}
export default function CommentsMobile({ setshowCommentsMobile, comments, setComments }: Props) {
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

  // --------------------------------------------------------------------------------- Input Modal
  const [showInputModal, setShowInputModal] = useState(false)
  function handleClickModal(event: React.MouseEvent<HTMLDivElement>) {
    if (event.currentTarget === event.target) {
      setshowCommentsMobile(false)
    }
  }

  // --------------------------------------------------------------------------------- Like & Unlike
  const { handleLike, handleUnlike } = useLikeComment()

  return (
    <div className="fixed inset-0 bg-gray-tp-2 z-[110]" onClick={handleClickModal}>
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem]">
        {/* title */}
        <div className="flex justify-between items-center p-2">
          <div
            className="w-12 h-12 flex justify-center items-center"
            onClick={() => setshowCommentsMobile(false)}>
            <IoMdClose className="w-6 h-6" />
          </div>
          <span className="font-medium text-xl">
            {commentNumber > 0
              ? `${commentNumber} Comment${commentNumber > 1 ? "s" : ""}`
              : "No comments yet"}
          </span>
          <div className="w-12"></div>
        </div>

        {/* comment list */}
        <div className="py-6 px-4 max-h-[70vh] min-h-[50vh] overflow-y-auto">
          {comments.map((comment) => {
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
            <div className="h-[50vh] flex justify-center items-center text-center">
              <span className="text-gray-font-4 font-light text-base">
                No comments yet! Add one to start the conversation.
              </span>
            </div>
          )}
        </div>

        {/* comment input */}
        <div className="flex gap-2 p-4 border-t border-gray-bg-1">
          <Image
            className="rounded-full object-cover"
            src={"/assets/test/avatar3.jpg"}
            alt="user avatar"
            width={48}
            height={48}
          />
          <div
            onClick={() => setShowInputModal(true)}
            className="w-[300px] h-12 px-4 rounded-full bg-gray-bg-4 leading-[3rem] text-gray-font-2 text-[15px]">
            Add a comment
          </div>
        </div>

        {showInputModal && <InputModal setComments={setComments} setShowInputModal={setShowInputModal} />}
      </div>
    </div>
  )
}
