import * as z from "zod"

export const PinValidation = z.object({
  image: z.string().url(),
  title: z.string().max(200, { message: "Maximum 200 characters" }),
  description: z.string().max(1000, { message: "Maximum 1000 characters" }),
  link: z.string().url(),
})
