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
import { FaAngleLeft } from "react-icons/fa6"
import { MdError } from "react-icons/md"
import toast from "react-hot-toast"

import Button from "@/components/shared/Button"
import { VirtualTextarea } from "@/components/form/VirtualTextarea"
import { fetchUserSettings, updateUserSetting } from "@/lib/actions/user.actions"
import Loading from "@/components/shared/Loading"
import { getErrorMessage, isBase64Image } from "@/lib/utils"
import { useUploadThing } from "@/lib/uploadthing"
import showMessageBox from "@/components/shared/showMessageBox"
import { deleteFiles } from "@/lib/actions/uploadthing.actions"
import { useAppDispatch, useAppSelector } from "@/lib/store/hook"
import { UserSetting } from "@/lib/types"
import { storeUserInfo } from "@/lib/store/features/user"

type Keys = keyof UserSetting
const FORM_FIELDS = ["imageUrl", "username", "firstName", "lastName", "about", "website"]
export default function Page() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(true)

  const defaultValues = useRef<UserSetting>({
    _id: "",
    id: "",
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

  const user = useAppSelector((state) => state.user.user)
  function loadUserSettings() {
    if (user === null) return
    defaultValues.current = user
    form.setValue("imageUrl", user.imageUrl)
    form.setValue("username", user.username)
    form.setValue("firstName", user.firstName)
    form.setValue("lastName", user.lastName || "")
    form.setValue("about", user.about || "")
    form.setValue("website", user.website || "")
    setIsLoading(false)
    setIsValidationPassed(false)
  }
  async function getUserSettings() {
    if (!user) return

    setIsLoading(true)
    const res = await fetchUserSettings(user._id)
    if ("errorMessage" in res) {
      toast.error(res.errorMessage)
      return
    }
    dispatch(storeUserInfo({ ...user, ...res }))
  }
  useEffect(() => {
    if (user) loadUserSettings()
  }, [user])

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
      if (!haveValuesChanged && FORM_FIELDS.includes(key) && form.getValues(key as Keys) !== value) {
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

  // ---------------------------------------------------------------------- Submit
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
        if (imgResponse && imgResponse[0].url) {
          values.imageUrl = imgResponse[0].url
        }
      } catch (error) {
        toast.error(getErrorMessage(error))
        return
      }
    }
    const res = await updateUserSetting({ _id: user._id, ...values })
    if (res === void 0) {
      showMessageBox({ message: "Profile saved!" })
      getUserSettings()
      // if the avatar changes AND the update succeeds, delete the previous avatar
      if (hasImageChanged) {
        deleteImage(prevAvatarUrl)
      }
    } else if ("isDuplicate" in res) {
      setIsDuplicateUsername(true)
    } else if ("errorMessage" in res) {
      toast.error(res.errorMessage)
    }
  }
  async function deleteImage(imageUrl: string) {
    try {
      await deleteFiles([imageUrl])
    } catch (error) {
      toast.error(getErrorMessage(error))
      return
    }
  }

  function resetForm() {
    form.reset(defaultValues.current)
  }

  return (
    <>
      {isLoading && <Loading />}
      <div className={`w3:mt-20 w3:h-[calc(100vh-160px)] w3:overflow-y-auto`}>
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
