"use client"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form"
import { Input } from "@/components/shadcn/input"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfileValidation } from "@/lib/validations/profile"

import { useEffect, useRef, useState, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import { FaAngleLeft } from "react-icons/fa6"
import { MdError } from "react-icons/md"
import toast from "react-hot-toast"

import Button from "@/components/shared/Button"
import { VirtualTextarea } from "@/components/form/VirtualTextarea"
import { fetchUserSettings, updateUser } from "@/lib/actions/user.actions"
import Loading from "@/components/shared/Loading"
import { getErrorMessage, isBase64Image } from "@/lib/utils"
import { useUploadThing } from "@/lib/uploadthing"
import showMessageBox from "@/lib/showMessageBox"
import { deleteFile } from "@/lib/actions/uploadthing"

interface Profile {
  imageUrl: string
  username: string
  firstName: string
  lastName?: string
  about?: string
  website?: string
}
type Keys = keyof Profile
export default function Page() {
  const router = useRouter()
  const { isSignedIn, user } = useUser()

  const defaultValues = useRef<Profile>({
    imageUrl: "",
    firstName: "",
    lastName: "",
    about: "",
    website: "",
    username: "",
  })
  const form = useForm({
    resolver: zodResolver(ProfileValidation),
    defaultValues: defaultValues.current,
  })

  const [isLoading, setIsLoading] = useState(true)
  async function getUserSettings() {
    if (!user) return
    setIsLoading(true)
    const res = await fetchUserSettings(user.id)
    if ("errorMessage" in res) {
      toast.error(res.errorMessage)
      return
    }

    defaultValues.current = res
    form.setValue("imageUrl", res.imageUrl)
    form.setValue("username", res.username)
    form.setValue("firstName", res.firstName)
    form.setValue("lastName", res.lastName || "")
    form.setValue("about", res.about || "")
    form.setValue("website", res.website || "")
    setIsLoading(false)
    setIsValidationPassed(false)
  }
  useEffect(() => {
    if (isSignedIn) {
      getUserSettings()
    }
  }, [isSignedIn])

  // when the user input changes, validate all form fields
  const [isValidationPassed, setIsValidationPassed] = useState(false)
  const [imageUrl, firstName, lastName, about, website, username] = form.watch([
    "imageUrl",
    "firstName",
    "lastName",
    "about",
    "website",
    "username",
  ])
  function checkValuesChange() {
    // In initail state, defaultValues.currnet.username is "". Prevent check until defaultValues gets real user info
    if (!defaultValues.current.username) return false

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
  }, [imageUrl, firstName, lastName, about, website, username])

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
  function handleChangeAvatar() {
    uploadRef?.current?.click()
  }

  function resetForm() {
    form.reset(defaultValues.current)
  }

  const { startUpload } = useUploadThing("avatar")
  const [isDuplicateUsername, setIsDuplicateUsername] = useState(false)
  async function onSubmit(values: z.infer<typeof ProfileValidation>) {
    if (!user) return
    setIsLoading(true)

    const prevAvatarUrl = defaultValues.current.imageUrl
    const blob = values.imageUrl // if the user uploads a image, the imageUrl will become a blob instead of a URL string
    const hasImageChanged = isBase64Image(blob)

    if (hasImageChanged) {
      try {
        const imgResponse = await startUpload(files)
        console.log("imgResponse", imgResponse)
        if (imgResponse && imgResponse[0].url) {
          values.imageUrl = imgResponse[0].url
        }
      } catch (error) {
        toast.error(getErrorMessage(error))
        return
      }
    }

    const res = await updateUser({ id: user.id, ...values, path: "/settings" })
    if (res === void 0) {
      showMessageBox({ message: "Profile saved!" })
      getUserSettings()
      // if the avatar changes AND the update succeeds, delete the previous avatar
      if (hasImageChanged) {
        deleteAvatar(prevAvatarUrl)
      }
      return
    } else if ("isDuplicate" in res) {
      setIsDuplicateUsername(true)
    } else if ("errorMessage" in res) {
      toast.error(res.errorMessage)
      return
    }
  }

  async function deleteAvatar(imageUrl: string) {
    try {
      await deleteFile(imageUrl)
    } catch (error) {
      toast.error(getErrorMessage(error))
      return
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      <div className={`w3:mt-20 w3:h-[calc(100vh-160px)] w3:overflow-y-auto ${isLoading && "hidden"}`}>
        <div className="w3:w-[600px] w3:mx-auto w3:pt-4">
          {/* title */}
          <div className="mb-8 max-w3:hidden">
            <h1 className="font-semibold text-[28px]">Edit Profile</h1>
            <p className="mt-2 font-normal">
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

          {/* duplicate username tip */}
          {isDuplicateUsername && (
            <p className="flex items-center gap-3 p-4 rounded-2xl bg-[#FFE0E0] font-normal mb-4">
              <MdError className="text-red-error" />
              Username already taken
            </p>
          )}

          <Form {...form}>
            <form className="max-w3:px-6 max-w3:pb-24">
              {/* image upload */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="max-w3:hidden label-default mb-1">Photo</FormLabel>
                    <FormControl>
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
              <div className="flex max-w3:flex-col items-center w3:gap-2 gap-4">
                <div className="relative w3:w-[75px] w3:h-[75px] w-[120px] h-[120px] mx-2">
                  {imageUrl.length > 0 && (
                    // double the resolution of the image to make it look better
                    <Image
                      src={imageUrl}
                      alt="user avatar"
                      fill
                      sizes="(max-width: 820px) 240px, (min-width: 820px) 150px"
                      className="rounded-full object-cover"
                    />
                  )}
                </div>
                <Button
                  text="Change"
                  bgColor="gray"
                  hover
                  clickEffect
                  size="small"
                  className="h-[40px]"
                  click={handleChangeAvatar}
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
                    <FormLabel className="label-default">Website</FormLabel>
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
              text="Reset"
              bgColor="gray"
              hover
              clickEffect
              disabled={!isValidationPassed}
              className={isValidationPassed ? "text-black" : "text-gray-font-4"}
              click={resetForm}
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
    </>
  )
}
