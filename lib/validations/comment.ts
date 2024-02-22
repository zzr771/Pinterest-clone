import * as z from "zod"

export const CommentValidation = z.object({
  reply: z.string().min(1).max(1000, { message: "Maximum 1000 characters" }),
})
