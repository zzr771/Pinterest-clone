import { COMMENT, EDIT_COMMENT } from "@/lib/apolloRequests/comment.request"
import { useAppSelector } from "@/lib/store/hook"
import { CommentInfo } from "@/lib/types"
import { handleApolloRequestError } from "@/lib/utils"
import { useMutation } from "@apollo/client"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { IoMdClose } from "react-icons/io"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../shadcn/form"
import { VirtualTextarea } from "../form/VirtualTextarea"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CommentValidation } from "@/lib/validations/comment"

interface Props {
  replyTo?: CommentInfo // for replying
  rootCommentId?: string // for replying
  setShowInputModal: React.Dispatch<React.SetStateAction<boolean>>
  setComments: React.Dispatch<React.SetStateAction<CommentInfo[]>>
  commentOnEdit?: CommentInfo // for editing
  setCommentOnEdit?: React.Dispatch<React.SetStateAction<CommentInfo | undefined>> // for editing
}
export default function InputModal({
  replyTo,
  rootCommentId,
  setShowInputModal,
  setComments,
  commentOnEdit,
  setCommentOnEdit,
}: Props) {
  const user = useAppSelector((store) => store.user.user)
  const [isInputValid, setIsInputValid] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: commentOnEdit?.content || "",
    },
  })
  const userInput: string = form.watch("comment")

  useEffect(() => {
    if (userInput.length > 0 && userInput.length <= 500) {
      setIsInputValid(true)
    } else {
      setIsInputValid(false)
    }
  }, [userInput])

  function handleClickModal(event: React.MouseEvent<HTMLDivElement>) {
    if (event.currentTarget === event.target) {
      setShowInputModal(false)
    }
  }

  // --------------------------------------------------------------------------------- Comment & Reply
  const pinId = usePathname().split("/").pop()
  async function onSubmit(values: z.infer<typeof CommentValidation>) {
    if (!isInputValid) {
      return
    }
    const isValid = await form.trigger()
    if (!isValid || !user) return

    if (commentOnEdit) {
      handleEdit(values.comment)
    } else {
      if (replyTo) {
        handleReply(values.comment)
      } else {
        handleComment(values.comment)
      }
    }
  }

  const [commentMutation] = useMutation(COMMENT, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })
  const [editCommentMutation] = useMutation(EDIT_COMMENT, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })
  async function handleComment(content: string) {
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
          content,
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
    form.reset()
  }
  async function handleReply(content: string) {
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
          content,
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
    form.reset()
  }
  async function handleEdit(content: string) {
    if (!user || !commentOnEdit) return
    const {
      data: { editComment: res },
    } = await editCommentMutation({
      variables: {
        pinId,
        commentId: commentOnEdit._id,
        content,
      },
    })

    setComments((prev) => {
      let targetFound = false
      return prev.map((item) => {
        if (targetFound) {
          return item
        } else if (item._id === res._id) {
          item.content = res.content
          targetFound = true
        } else {
          item.replies.forEach((reply) => {
            if (reply._id === res._id) {
              reply.content = res.content
              targetFound = true
              return
            }
          })
        }
        return item
      })
    })
    setShowInputModal(false)
    setCommentOnEdit && setCommentOnEdit(undefined)
    form.reset()
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

        <div className="relative flex flex-col z-[1] mt-5 mx-7">
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="flex gap-3 items-center w-full">
                    <FormControl className="bg-transparent">
                      <VirtualTextarea
                        className="w-full text-gray-font-4 text-sm"
                        minRows={5}
                        maxRows={20}
                        focusOnMount
                        placeholder="Share what you like about this Pin, how it inspired you, or simply give a compliment"
                        {...field}
                        ref={textAreaRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {/* character number & post */}
          <div className="flex justify-end items-center gap-3 my-3 mr-[-1rem]">
            <span className={`text-xs ${userInput.length > 500 ? "text-red" : ""}`}>
              {userInput.length}/500
            </span>
            <div
              className={`w-[3.75rem] h-8 rounded-full font-semibold text-sm text-center leading-8 ${
                isInputValid ? "bg-red text-white" : "bg-gray-bg-4 text-gray-font-4"
              }`}
              onClick={form.handleSubmit(onSubmit)}>
              Post
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
