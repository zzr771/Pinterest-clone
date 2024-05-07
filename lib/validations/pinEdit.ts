import * as z from "zod"

const urlRegExp = /^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^/\s]*)*$/
export const PinEditValidation = z.object({
  title: z
    .string()
    .trim()
    .max(100, { message: "Title is too long. Only the first 100 characters will be displayed." })
    .optional(),
  description: z
    .string()
    .trim()
    .max(800, { message: "Description too long. Only the first 800 characters will be displayed." })
    .optional(),
  link: z
    .string()
    .trim()
    .refine((value) => urlRegExp.test(value), {
      message: "Oops! That URL isn't valid—please try again!",
    })
    .optional()
    .or(z.literal("")),
})
