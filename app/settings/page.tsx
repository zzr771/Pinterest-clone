"use client"
import { useEffect, useRef, useState, ChangeEvent } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form"
import { Input } from "@/components/shadcn/input"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfileValidation } from "@/lib/validations/profile"

import Button from "@/components/shared/Button"
import { VirtualTextarea } from "@/components/form/VirtualTextarea"
import Image from "next/image"

interface Profile {
  _id: string
  image: string
  firstName: string
  lastName?: string
  about?: string
  website?: string
  username: string
}
export default function Page({ params }: { params: { userId: string } }) {
  const [isValidationPassed, setIsValidationPassed] = useState(false)
  const form = useForm({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      image: "/assets/test/avatar2.jpg",
      firstName: "Ray",
      lastName: "",
      about: "",
      website: "",
      username: "LightYear",
    },
  })

  // when the user input changes, validate all form fields
  const [image, firstName, lastName, about, website, username] = form.watch([
    "image",
    "firstName",
    "lastName",
    "about",
    "website",
    "username",
  ])

  useEffect(() => {
    form.trigger().then((result) => {
      setIsValidationPassed(result)
    })
  }, [image, firstName, lastName, about, website, username])

  const [files, setFiles] = useState<File[]>([])
  function handleImage(e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) {
    e.preventDefault() // prevent browser reloading
    const fileReader = new FileReader()
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (!file.type.includes("image")) return

      setFiles(Array.from(e.target.files))

      fileReader.readAsDataURL(file)
      fileReader.onload = (event) => {
        const imageDataUrl = event.target?.result?.toString() || ""
        fieldChange(imageDataUrl)
      }
    }
  }

  const uploadRef = useRef<HTMLInputElement>(null)
  function handleClickChange() {
    uploadRef?.current?.click()
  }

  async function onSubmit(values: z.infer<typeof ProfileValidation>) {
    console.log("onSubmit")
    form.reset()
  }

  return (
    <div className="mt-20 h-[calc(100vh-160px)] overflow-y-auto">
      <div className="w-[600px] mx-auto pt-4">
        {/* title */}
        <div className="mb-8">
          <h1 className="font-semibold text-[28px]">Edit Profile</h1>
          <p className="mt-2 font-light">
            Keep your personal details private. Information you add here is visible to anyone who can view
            your profile.
          </p>
        </div>

        <Form {...form}>
          <form>
            {/* image upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-default mb-1">Photo</FormLabel>
                  <FormControl className="border-none bg-transparent">
                    <Input
                      ref={uploadRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImage(e, field.onChange)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* avatar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-[75px] h-[75px] mx-2 rounded-full bg-gray-bg-4">
                <Image
                  src={image}
                  alt="user avatar"
                  width={65}
                  height={65}
                  className="rounded-full object-cover"
                />
              </div>
              <Button
                text="Change"
                bgColor="gray"
                hover
                clickEffect
                size="small"
                className="h-[40px]"
                click={handleClickChange}
              />
            </div>

            {/* name */}
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-1 mt-5">
                    <FormLabel className="label-default">First name</FormLabel>
                    <FormControl>
                      <Input type="text" className="input-default h-[49px] px-4 py-3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-1 mt-5">
                    <FormLabel className="label-default">Last name</FormLabel>
                    <FormControl>
                      <Input type="text" className="input-default h-[49px] px-4 py-3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* about */}
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem className="space-y-1 mt-5">
                  <FormLabel className="label-default">About</FormLabel>
                  <FormControl>
                    <VirtualTextarea
                      className="input-default p-4"
                      minRows={4}
                      maxRows={4}
                      placeHolder={"Tell your story"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* website */}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="space-y-1 mt-5">
                  <FormLabel className="label-default">Link</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="input-default h-[49px] px-4 py-3"
                      placeholder="Add a link to drive traffic to your site"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1 mt-5">
                  <FormLabel className="label-default">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="input-default h-[49px] px-4 py-3"
                      placeholder="Choose wisely so others can find you"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      {/* bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 py-4 shadow-medium">
        <div className="flex justify-end gap-2 w-[600px] mx-auto">
          <Button
            key="Reset"
            text="Reset"
            bgColor="gray"
            hover
            clickEffect
            className={isValidationPassed ? "text-black" : "text-gray-font-4"}
          />
          <Button
            text="Save"
            bgColor={isValidationPassed ? "red" : "gray"}
            hover
            clickEffect
            click={form.handleSubmit(onSubmit)}
            disabled={!isValidationPassed}
            className={isValidationPassed ? "text-white" : "text-gray-font-4"}
          />
        </div>
      </div>
    </div>
  )
}
