import * as z from "zod"

const urlRegExp = /^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^/\s]*)*$/
export const ProfileValidation = z.object({
  imageUrl: z.string(),
  firstName: z
    .string()
    .trim()
    .min(1, { message: "Your profile needs a name" })
    .max(30, { message: "Please enter no more than 30 characters." }),
  lastName: z.string().trim().max(30, { message: "Please enter no more than 30 characters." }).optional(),
  about: z.string().trim().max(500, { message: "Please enter no more than 500 characters." }).optional(),
  username: z
    .string()
    .trim()
    .min(1, { message: "Your profile needs a username" })
    .max(50, { message: "Please enter no more than 50 characters." }),
  website: z
    .string()
    .trim()
    .refine((value) => urlRegExp.test(value), {
      message: "Oops! That URL isn't valid. Please try again!",
    })
    .optional()
    .or(z.literal("")),
})
