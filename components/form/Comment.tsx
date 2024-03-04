import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../shadcn/form" // 这些组件来自库 shadcn
import { Textarea } from "../shadcn/textarea"
import Button from "../shared/Button"
import { IoIosSend } from "react-icons/io"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CommentValidation } from "@/lib/validations/comment"
import { VirtualTextarea } from "./VirtualTextarea"

export default function Comment() {
  const [isFocused, setIsFocused] = useState(false)

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: "",
    },
  })
  const userInput: string = form.watch("comment")

  async function onSubmit(values: z.infer<typeof CommentValidation>) {}

  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex flex-none justify-center items-center h-12 w-12 bg-gray-bg-1 rounded-full">
        <Image
          className="rounded-full"
          src="/assets/test/avatar2.jpg"
          width={48}
          height={48}
          alt="user avatar"
        />
      </div>

      <Form {...form}>
        <form
          className={`flex flex-1 rounded-3xl items-center border-solid border 
          ${
            isFocused
              ? "bg-white hover:bg-white border-gray-bg-4"
              : "bg-gray-bg-4 hover:bg-gray-bg-5 border-transparent"
          }
          `}>
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-0">
                <FormControl>
                  <div onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
                    <VirtualTextarea
                      className="p-4 w-[330px]"
                      minRows={1}
                      maxRows={5}
                      placeHolder="Add a comment"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
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
