"use client"
import { useEffect, useRef, useState, ChangeEvent } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form"
import { Input } from "@/components/shadcn/input"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfileValidation } from "@/lib/validations/profile"

import Image from "next/image"
import { FaAngleLeft } from "react-icons/fa6"
import Button from "@/components/shared/Button"
import { VirtualTextarea } from "@/components/form/VirtualTextarea"
import { useRouter } from "next/navigation"

interface Profile {
  _id: string
  image: string
  firstName: string
  lastName?: string
  about?: string
  website?: string
  username: string
}
type Keys = keyof Profile
export default function Page({ params }: { params: { userId: string } }) {
  const router = useRouter()
  const [isValidationPassed, setIsValidationPassed] = useState(false)
  const defaultValues = useRef<Profile>({
    _id: "4f65se4f8sef46s54f",
    image: "/assets/test/avatar2.jpg",
    firstName: "Ray",
    lastName: "",
    about: "",
    website: "",
    username: "LightYear",
  })
  const form = useForm({
    resolver: zodResolver(ProfileValidation),
    defaultValues: defaultValues.current,
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

  function checkValuesChange() {
    let haveValuesChanged = false
    Object.entries(defaultValues.current).forEach(([key, value]) => {
      if (!haveValuesChanged && form.getValues(key as Keys) !== value) {
        haveValuesChanged = true
        return
      }
    })
    return haveValuesChanged
  }

  useEffect(() => {
    form.trigger().then((result) => {
      if (result && checkValuesChange()) {
        setIsValidationPassed(true)
      } else {
        setIsValidationPassed(false)
      }
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
    form.reset()
  }

  return (
    <div className="w3:mt-20 w3:h-[calc(100vh-160px)] w3:overflow-y-auto">
      <div className="w3:w-[600px] w3:mx-auto w3:pt-4">
        {/* title */}
        <div className="mb-8 max-w3:hidden">
          <h1 className="font-semibold text-[28px]">Edit Profile</h1>
          <p className="mt-2 font-light">
            Keep your personal details private. Information you add here is visible to anyone who can view
            your profile.
          </p>
        </div>
        {/* title on mobile*/}
        <div className="w3:hidden relative h-[84px] py-3 px-2 flex items-center justify-between">
          <Button rounded className="!h-10 w-10" click={() => router.back()}>
            <FaAngleLeft className="w-5 h-5 text-black" />
          </Button>
          <h1 className="horizontal-middle font-medium text-[19px]">Edit profile</h1>
          <Button
            text="Done"
            clickEffect
            click={form.handleSubmit(onSubmit)}
            bgColor={isValidationPassed ? "red" : "gray"}
            disabled={!isValidationPassed}
            className={`!h-10 !px-3 mr-1 ${isValidationPassed ? "text-white" : "text-gray-font-4"}`}
          />
        </div>

        <Form {...form}>
          <form className="max-w3:px-6 max-w3:pb-24">
            {/* image upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="max-w3:hidden label-default mb-1">Photo</FormLabel>
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
            <div className="flex max-w3:flex-col items-center w3:gap-3 gap-4">
              <div className="relative w3:w-[75px] w3:h-[75px] w-[120px] h-[120px] mx-2">
                <Image
                  src={image}
                  alt="user avatar"
                  fill
                  sizes="(max-width: 819px) 120px, (min-widt: 820px) 75px"
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
            <div className="flex max-w3:flex-col gap-2">
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
                  <FormItem className="flex-1 space-y-1 mt-5 max-w3:mt-3">
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
                <FormItem className="space-y-1 mt-5 max-w3:mt-3">
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
                <FormItem className="space-y-1 mt-5 max-w3:mt-3">
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
                <FormItem className="space-y-1 mt-5 max-w3:mt-3">
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
                  <p className="custome-form-message">www.pinterest.com/{username}</p>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      {/* bottom buttons */}
      <div className="max-w3:hidden fixed bottom-0 left-0 right-0 py-4 shadow-medium">
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
            hover
            clickEffect
            click={form.handleSubmit(onSubmit)}
            bgColor={isValidationPassed ? "red" : "gray"}
            disabled={!isValidationPassed}
            className={isValidationPassed ? "text-white" : "text-gray-font-4"}
          />
        </div>
      </div>
    </div>
  )
}
