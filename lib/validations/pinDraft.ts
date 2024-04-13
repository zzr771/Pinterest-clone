import * as z from "zod"

export const PinDraftValidation = z.object({
  imageUrl: z.string(),
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
    .url({ message: "Oops! That URL isn't valid—please try again!" })
    .optional()
    .or(z.literal("")),
})
