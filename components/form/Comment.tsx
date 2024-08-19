import Image from "next/image"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../shadcn/form" // 这些组件来自库 shadcn
import Button from "../shared/Button"
import { IoIosSend } from "react-icons/io"

import { FaUser } from "react-icons/fa"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CommentValidation } from "@/lib/validations/comment"
import { VirtualTextarea } from "./VirtualTextarea"
import { useAppSelector } from "@/lib/store/hook"
import { useMutation } from "@apollo/client"
import { COMMENT } from "@/lib/apolloRequests/comment.request"
import { handleApolloRequestError } from "@/lib/utils"
import toast from "react-hot-toast"
import { CommentInfo } from "@/lib/types"
import { usePathname } from "next/navigation"

interface Props {
  setComments: React.Dispatch<React.SetStateAction<CommentInfo[]>>
}
export default function Comment({ setComments }: Props) {
  const user = useAppSelector((store) => store.user.user)
  const pinId = usePathname().split("/").pop()

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: "",
    },
  })
  const userInput: string = form.watch("comment")

  const [commentMutation] = useMutation(COMMENT, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })
  async function onSubmit(values: z.infer<typeof CommentValidation>) {
    if (!user) {
      toast("Please sign in before operation")
      return
    }

    const isValid = await form.trigger()
    if (!isValid || !user) return

    const {
      data: { comment: res },
    } = await commentMutation({
      variables: {
        input: {
          pinId,
          userId: user._id,
          content: values.comment,
          isReply: false,
          replyToUser: null,
          replyToComment: null,
        },
      },
    })
    setComments((prev) => {
      /*
            In React 18 strict mode, the callback passed to setState will be called twice to check if
          it is a pure function.
            "!prev.includes(res)" is necessary to prevent adding 'res' to 'comments' for a second time.
        */
      if (!prev.includes(res)) {
        return [...prev, res]
      }
      return prev
    })
    form.reset()
  }

  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex flex-none justify-center items-center h-12 w-12 bg-gray-bg-1 rounded-full">
        {user?.imageUrl ? (
          <Image
            className="rounded-full object-cover h-12"
            src={user.imageUrl}
            width={48}
            height={48}
            alt="user avatar"
          />
        ) : (
          <FaUser className="text-gray-font-3 w-7 h-7" />
        )}
      </div>

      <Form {...form}>
        <form className="flex flex-1 rounded-3xl items-center border-solid border-2 border-gray-bg-4">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-0">
                <FormControl>
                  <VirtualTextarea
                    className="p-4 w-[330px]"
                    minRows={1}
                    maxRows={5}
                    placeholder="Add a comment"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="ml-4 pb-2" />
              </FormItem>
            )}
          />
          <div className="w-10 h-10 m-1.5">
            {userInput.length > 0 && (
              <Button
                bgColor="red"
                rounded
                hover
                clickEffect
                className="w-10 !h-10"
                click={form.handleSubmit(onSubmit)}>
                <IoIosSend className="w-5 h-5" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
