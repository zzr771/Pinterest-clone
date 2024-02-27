import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../shadcn/form" // 这些组件来自库 shadcn
import { Textarea } from "../shadcn/textarea"
import Button from "../shared/Button"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReplyValidation } from "@/lib/validations/comment"

interface Props {
  close: () => void
}
export default function Reply({ close }: Props) {
  const form = useForm({
    resolver: zodResolver(ReplyValidation),
    defaultValues: {
      reply: "",
    },
  })
  // watch user input and render the "save" button correspondingly
  const userInput: string = form.watch("reply")

  async function onSubmit(values: z.infer<typeof ReplyValidation>) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="reply"
          render={({ field }) => (
            <FormItem className="flex gap-3 items-center w-full">
              <FormControl className="border-none bg-transparent">
                <Textarea
                  className="resize-none border-solid border-gray-bg-4 rounded-2xl no-focus"
                  rows={2}
                  placeholder="Reply"
                  {...field}
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
            click={close}
          />
          <Button
            text="Save"
            size="small"
            clickEffect={userInput.length > 0}
            bgColor={userInput.length > 0 ? "red" : "gray"}
            hover={userInput.length > 0}
            className={`py-5 ${userInput.length === 0 && "text-gray-font-4"}`}
          />
        </div>
      </form>
    </Form>
  )
}
