import { COMMENT } from "@/lib/apolloRequests/comment.request"
import { useAppSelector } from "@/lib/store/hook"
import { CommentInfo } from "@/lib/types"
import { handleApolloRequestError } from "@/lib/utils"
import { useMutation } from "@apollo/client"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { IoMdClose } from "react-icons/io"

interface Props {
  replyTo?: CommentInfo // for replying
  rootCommentId?: string // for replying
  setShowInputModal: React.Dispatch<React.SetStateAction<boolean>>
  setComments: React.Dispatch<React.SetStateAction<CommentInfo[]>>
}
export default function InputModal({ replyTo, rootCommentId, setShowInputModal, setComments }: Props) {
  const user = useAppSelector((store) => store.user.user)
  const [input, setInput] = useState("")
  const [isInputValid, setIsInputValid] = useState(false)
  const virtualTextAreaRef = useRef<HTMLDivElement>(null)

  // When the text length exceeds 500, only the backspace key can be used
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const text = virtualTextAreaRef.current?.textContent || ""
    if (text.length >= 500 && event.key !== "Backspace") {
      event.preventDefault()
    }
  }
  function handleChange() {
    const text = virtualTextAreaRef.current?.textContent || ""
    setInput(text)
  }

  useEffect(() => {
    if (input.length > 0 && input.length <= 500) {
      setIsInputValid(true)
    } else {
      setIsInputValid(false)
    }
  }, [input])

  function handleClickModal(event: React.MouseEvent<HTMLDivElement>) {
    if (event.currentTarget === event.target) {
      setShowInputModal(false)
    }
  }

  // --------------------------------------------------------------------------------- Comment & Reply
  const pinId = usePathname().split("/").pop()
  function handlePost() {
    if (!isInputValid) {
      return
    }
    if (replyTo) {
      handleReply()
    } else {
      handleComment()
    }
  }
  const [commentMutation] = useMutation(COMMENT, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })

  async function handleComment() {
    if (!user) {
      toast("Please sign in before operation")
      return
    }

    const {
      data: { comment: res },
    } = await commentMutation({
      variables: {
        input: {
          pinId,
          userId: user._id,
          content: input,
          isReply: false,
          replyToUser: null,
          replyToComment: null,
        },
      },
    })

    setComments((prev) => {
      if (!prev.includes(res)) {
        return [...prev, res]
      }
      return prev
    })
    setShowInputModal(false)
  }

  async function handleReply() {
    if (!user) {
      toast("Please sign in before operation")
      return
    }
    if (!replyTo) {
      toast.error("Someting went wrong")
      return
    }

    const {
      data: { comment: res },
    } = await commentMutation({
      variables: {
        input: {
          pinId,
          userId: user._id,
          content: input,
          isReply: true,
          replyToUser: replyTo.isReply ? replyTo.author._id : null,
          replyToComment: rootCommentId,
        },
      },
    })

    setComments((prev) => {
      return prev.map((item) => {
        if (item._id === rootCommentId && !item.replies.includes(res)) {
          item.replies = [...item.replies, res]
        }
        return item
      })
    })
    setShowInputModal(false)
  }

  return (
    <div className="fixed inset-0 bg-gray-tp-2 z-[20]" onClick={handleClickModal}>
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] text-base">
        {/* title */}
        <div className="flex justify-between items-center p-2">
          <div
            className="w-12 h-12 flex justify-center items-center"
            onClick={() => setShowInputModal(false)}>
            <IoMdClose className="w-6 h-6" />
          </div>
          {/* todo: username */}
          <span className="font-medium">
            {replyTo ? `Reply to ${replyTo.author.firstName}` : "Add a comment"}
          </span>
          <div className="w-12"></div>
        </div>

        {/* virtual textarea */}
        <div className="relative flex flex-col z-[1] mt-5 mx-7 min-h-[164px]">
          <div className="placeholder absolute z-[-1] text-[#9CA3AF] text-[15px] font-normal">
            {input.length > 0
              ? ""
              : "Share what you like about this Pin, how it inspired you, or simply give a compliment"}
          </div>
          <div
            className="flex-1 text-gray-font-4 cursor-pointer focus:outline-none break-word"
            ref={virtualTextAreaRef}
            onKeyDown={handleKeyDown}
            onInput={handleChange}
            contentEditable></div>

          {/* character number & post */}
          <div className="flex justify-end items-center gap-3 my-3 mr-[-1rem]">
            <span className={`text-xs ${input.length > 500 ? "text-red" : ""}`}>{input.length}/500</span>
            <div
              className={`w-[3.75rem] h-8 rounded-full font-semibold text-sm text-center leading-8 ${
                isInputValid ? "bg-red text-white" : "bg-gray-bg-4 text-gray-font-4"
              }`}
              onClick={handlePost}>
              Post
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
