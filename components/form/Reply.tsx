// This component is used for replying to a comment/reply and editing a comment/reply
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../shadcn/form"
import { VirtualTextarea } from "./VirtualTextarea"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CommentValidation } from "@/lib/validations/comment"

import Button from "../shared/Button"
import { useEffect, useRef } from "react"
import { useAppSelector } from "@/lib/store/hook"
import { useMutation } from "@apollo/client"
import { handleApolloRequestError } from "@/lib/utils"
import { CommentInfo } from "@/lib/types"
import { COMMENT, EDIT_COMMENT } from "@/lib/apolloRequests/comment.request"
import { usePathname } from "next/navigation"

interface Props {
  replyTo: CommentInfo // for replying
  rootCommentId: string // for replying
  setShowReplyInput: React.Dispatch<React.SetStateAction<boolean>>
  setComments: React.Dispatch<React.SetStateAction<CommentInfo[]>>
  commentOnEdit?: CommentInfo // for editing
  setCommentOnEdit?: React.Dispatch<React.SetStateAction<CommentInfo | undefined>> // for editing
}
export default function Reply({
  replyTo,
  rootCommentId,
  setShowReplyInput,
  setComments,
  commentOnEdit,
  setCommentOnEdit,
}: Props) {
  const user = useAppSelector((store) => store.user.user)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const pinId = usePathname().split("/").pop()

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: commentOnEdit?.content || "",
    },
  })
  // watch user input and render the "save" button correspondingly
  const userInput: string = form.watch("comment")

  // ----------------------------------------------------------------------------------- Requests
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

  async function onSubmit(values: z.infer<typeof CommentValidation>) {
    const isValid = await form.trigger()
    if (!isValid || !user) return

    if (commentOnEdit) {
      handleEdit(values.comment)
    } else {
      handleReply(values.comment)
    }
  }

  async function handleReply(content: string) {
    if (!user) return
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
        /*
            In React 18 strict mode, the callback passed to setState will be called twice to check if
          it is a pure function.
            "!item.replies.includes(res)" is necessary to prevent adding 'res' to 'item.replies' for a second time.
        */
        if (item._id === rootCommentId && !item.replies.includes(res)) {
          item.replies = [...item.replies, res]
        }
        return item
      })
    })
    setShowReplyInput(false)
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
    setShowReplyInput(false)
    setCommentOnEdit && setCommentOnEdit(undefined)
    form.reset()
  }

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex gap-3 items-center w-full">
              <FormControl className="bg-transparent">
                <VirtualTextarea
                  className="w-full border-2 border-solid border-gray-bg-4 rounded-2xl pl-4 pr-2 py-3 text-gray-font-4"
                  minRows={2}
                  maxRows={5}
                  focusOnMount
                  placeholder="Reply"
                  {...field}
                  ref={textAreaRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end mt-4 gap-2">
          <Button
            text="Cancel"
            size="small"
            bgColor="gray"
            className="py-5"
            hover
            clickEffect
            click={() => {
              setShowReplyInput(false)
              setCommentOnEdit && setCommentOnEdit(undefined)
            }}
          />
          <Button
            text="Save"
            size="small"
            clickEffect={userInput.length > 0}
            bgColor={userInput.length > 0 ? "red" : "gray"}
            hover={userInput.length > 0}
            className={`py-5 ${userInput.length === 0 && "text-gray-font-4"}`}
            click={form.handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </Form>
  )
}
