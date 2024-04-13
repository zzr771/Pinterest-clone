import { useEffect, useRef, useState, ChangeEvent, useMemo, useCallback } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form"
import { Input } from "@/components/shadcn/input"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { PinDraftValidation } from "@/lib/validations/pinDraft"

import { FaArrowUp } from "react-icons/fa"
import { debounce } from "lodash"
import Button from "@/components/shared/Button"
import { VirtualTextarea } from "@/components/form/VirtualTextarea"
import type { PinDraft } from "@/lib/types"
import { getErrorMessage, isValidUrl } from "@/lib/utils"
import { useUploadThing } from "@/lib/uploadthing"
import toast from "react-hot-toast"
import { deleteFiles } from "@/lib/actions/uploadthing.actions"
import { upsertDraft } from "@/lib/actions/user.actions"
import { useAuth } from "@clerk/nextjs"
import Image from "next/image"

/*
    When a user edits a draft, one request that updates the database will be sent. But the UI doesn't refresh.
*/
interface Props {
  setDraftList: React.Dispatch<React.SetStateAction<PinDraft[]>>
  draftOnEdit: PinDraft
  setDraftOnEdit: React.Dispatch<React.SetStateAction<PinDraft>>
  isCreatingDraft: boolean
  setIsCreatingDraft: React.Dispatch<React.SetStateAction<boolean>>
  getDraftList: () => void
}
export default function PinForm({
  setDraftList,
  draftOnEdit,
  setDraftOnEdit,
  isCreatingDraft,
  setIsCreatingDraft,
  getDraftList,
}: Props) {
  const formDisplayContainerRef = useRef<HTMLDivElement>(null)
  const formDisplayDivRef = useRef<HTMLDivElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)

  const [isSaving, setIsSaving] = useState(false) // Tip:' Saving...'
  const [showChangeTip, setShowChangeTip] = useState(false) // Tip: 'Changes stored!'
  const prevImageUrl = useRef("") // Used for deleting the previous image when a new one is uploaded
  const isInitialLoading = useRef(true) // when 'draftOnEdit' changes, this value will be set to 'true'
  const currentDraft = useMemo(() => draftOnEdit, [draftOnEdit]) // store the edited draft when sending requests, in case users click other drafts

  // auto-layout according to the content area width
  const handleSrceenResize = useCallback(
    debounce(() => {
      const formDisplayContainer = formDisplayContainerRef.current
      const formDisplayDiv = formDisplayDivRef.current
      const upload = uploadRef.current
      if (!formDisplayDiv || !formDisplayContainer || !upload) return

      if (formDisplayContainer.clientWidth < 1020) {
        formDisplayDiv.style.flexDirection = "column"
        formDisplayDiv.style.alignItems = "center"
        upload.style.left = "105px"
      } else {
        formDisplayDiv.style.flexDirection = "row"
        formDisplayDiv.style.alignItems = "start"
        upload.style.left = "0px"
      }
    }, 100),
    []
  )
  useEffect(() => {
    if (!formDisplayContainerRef.current) return

    const resizeObserver = new ResizeObserver(handleSrceenResize)
    resizeObserver.observe(formDisplayContainerRef.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const form = useForm({
    resolver: zodResolver(PinDraftValidation),
    defaultValues: {
      imageUrl: "",
      title: "",
      description: "",
      link: "",
    },
  })
  const [imageUrl, title, description, link] = form.watch(["imageUrl", "title", "description", "link"])
  useEffect(() => {
    form.setValue("imageUrl", draftOnEdit?.imageUrl || "")
    form.setValue("description", draftOnEdit?.description || "")
    form.setValue("title", draftOnEdit?.title || "")
    form.setValue("link", draftOnEdit?.link || "")
    prevImageUrl.current = draftOnEdit?.imageUrl || ""
    isInitialLoading.current = true
  }, [draftOnEdit._id])

  // ---------------------------------------------------------------------- Read image
  const [files, setFiles] = useState<File[]>([])
  function handleImage(e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) {
    e.preventDefault() // prevent browser reloading
    const fileReader = new FileReader()
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (!file.type.includes("image")) return

      setFiles(Array.from(e.target.files))

      fileReader.readAsDataURL(file)
    }
  }
  function getImageSize() {
    const image = document.createElement("img")
    image.src = URL.createObjectURL(files[0])
    image.onload = () => {
      setDraftOnEdit({
        ...draftOnEdit,
        imageSize: {
          width: image.width,
          height: image.height,
        },
      })
    }
  }
  useEffect(() => {
    if (files.length > 0) {
      getImageSize()
      uploadImage()
    }
  }, [files])

  function handleClickImage() {
    uploadRef?.current?.click()
  }

  // ---------------------------------------------------------------------- Upload image to uploadthing
  const { startUpload } = useUploadThing("pin")
  async function uploadImage() {
    setIsSaving(true)
    if (!draftOnEdit.imageUrl) {
      setIsCreatingDraft(true)
    }
    try {
      const imgResponse = await startUpload(files)

      if (imgResponse && imgResponse[0].url) {
        form.setValue("imageUrl", imgResponse[0].url) // setValue() will cause 'imageUrl' to change, then trigger useEffect, and finally call 'submit'
        prevImageUrl.current && deleteImage(prevImageUrl.current)
        prevImageUrl.current = imgResponse[0].url
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }
  async function deleteImage(imageUrl: string) {
    const res = await deleteFiles([imageUrl])
    if (res && "errorMessage" in res) {
      toast.error(getErrorMessage(res))
    }
  }

  // ---------------------------------------------------------------------- Listen to form changes
  const timer = useRef(0)
  useEffect(() => {
    if (timer.current > 0) {
      clearTimeout(timer.current)
    }

    timer.current = window.setTimeout(() => {
      timer.current = 0
      if (isInitialLoading.current) {
        isInitialLoading.current = false
        return
      }
      if (!isValidUrl(imageUrl)) return

      form.trigger().then((result) => {
        if (result) {
          submit()
        }
      })
    }, 500)
  }, [imageUrl, title, description, link])
  function handleChangeTip() {
    setShowChangeTip(true)
    setTimeout(() => {
      setShowChangeTip(false)
    }, 3000)
  }

  // ---------------------------------------------------------------------- Submit form changes
  const { userId } = useAuth()
  const submit = form.handleSubmit(onSubmit)
  async function onSubmit(values: z.infer<typeof PinDraftValidation>) {
    if (!userId || !draftOnEdit) return

    setIsSaving(true)
    const res = await upsertDraft(userId, {
      ...draftOnEdit,
      ...values,
    })

    setIsSaving(false)
    if (res && "errorMessage" in res) {
      toast.error(res.errorMessage)
      return
    }

    // if the draft is new created
    if (isCreatingDraft) {
      await getDraftList()
      setIsCreatingDraft(false)
      setDraftOnEdit(res)
    } else {
      // store draft changes in draftList
      setDraftList((prev) => {
        const index = prev.findIndex((item) => item._id === res._id)
        const newList = [...prev]
        newList.splice(index, 1, res)
        return newList
      })
    }

    handleChangeTip()
  }

  // ---------------------------------------------------------------------- Publish
  async function publish() {}

  return (
    <section className="flex-1 flex flex-col border-t main-content border-gray-bg-6">
      <div className="flex flex-none h-20 justify-between items-center px-[1.875rem]">
        <h4 className="font-medium text-lg">Create Pin</h4>
        <div className="flex items-center gap-3">
          {isSaving && <span className="text-gray-font-4">Saving...</span>}
          {!isSaving && showChangeTip && <span className="text-gray-font-4">Changes stored!</span>}
          {imageUrl.length > 0 && <Button text="Publish" bgColor="red" hover click={publish} />}
        </div>
      </div>

      <div
        ref={formDisplayContainerRef}
        className="flex-1 flex justify-center border-t border-gray-bg-6 pt-6 overflow-y-auto">
        <div ref={formDisplayDivRef} className="flex flex-row gap-12 relative">
          {/* image upload part: just a div. A transparent <input type='file' /> overlaps it */}
          {imageUrl.length === 0 && (
            <div className="flex-none flex flex-col items-center justify-between w-[375px] h-[453px] border-2 border-dashed border-gray-bg-6 bg-gray-bg-4 rounded-[2rem]">
              {/* placehoder */}
              <div className="h-24"></div>
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black">
                  <FaArrowUp className="w-3.5 h-3.5 text-gray-bg-6" />
                </div>
                <div className="w-[220px] text-center text-[15px] font-light">
                  Choose a file or drag and drop it here
                </div>
              </div>
              <div className="py-8 px-4 text-[13px] text-center font-light">
                We recommend using high quality .jpg files less than 20MB
              </div>
            </div>
          )}
          {imageUrl.length > 0 && (
            <div className="flex-none w-[375px] max-h-[900px] cursor-pointer" onClick={handleClickImage}>
              <Image
                src={imageUrl}
                alt="uploaded image"
                className="object-contain rounded-[2rem]"
                width={375}
                height={200}
                sizes="750px"
              />
            </div>
          )}

          {/* form part */}
          <Form {...form}>
            <form className="flex-none w-[584px]">
              {/* image upload */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className={`${imageUrl.length > 0 && "hidden"}`}>
                    <FormControl className="border-none bg-transparent">
                      <Input
                        ref={uploadRef}
                        type="file"
                        accept="image/*"
                        className={`absolute z-[1] left-0 top-0 w-[375px] h-[453px] p-0 opacity-0 rounded-[2rem] cursor-pointer ${
                          isCreatingDraft && "invisible"
                        }`}
                        onChange={(e) => handleImage(e, field.onChange)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="relative">
                {/* translucent cover layer */}
                {!imageUrl && <div className="absolute inset-0 z-10 bg-gray-tp-4"></div>}

                {/* title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-1 mb-5">
                      <FormLabel className="label-default">Title</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="input-default h-[49px] px-4 py-3"
                          placeholder="Add a title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-1 mb-5">
                      <FormLabel className="label-default">Description</FormLabel>
                      <FormControl>
                        <VirtualTextarea
                          className="input-default p-4"
                          minRows={3}
                          maxRows={6}
                          placeHolder={"Add a detailed description"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* link */}
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem className="space-y-1 mb-5">
                      <FormLabel className="label-default">Link</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="input-default h-[49px] px-4 py-3"
                          placeholder="Add a link"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  )
}
