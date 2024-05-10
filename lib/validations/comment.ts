import * as z from "zod"

export const CommentValidation = z.object({
  comment: z.string().trim().min(1).max(500, { message: "Max length: 500 characters" }),
})
