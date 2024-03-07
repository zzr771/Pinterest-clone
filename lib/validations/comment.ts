import * as z from "zod"

export const CommentValidation = z.object({
  comment: z.string().trim().min(1).max(1000, { message: "Maximum 1000 characters" }),
})
export const ReplyValidation = z.object({
  reply: z.string().trim().min(1).max(1000, { message: "Maximum 1000 characters" }),
})
