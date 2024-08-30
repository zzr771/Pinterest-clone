import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form"
import { Input } from "@/components/shadcn/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { PinDraftValidation } from "@/lib/validations/pinDraft"

import { useEffect, useRef, useState, ChangeEvent, useCallback } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import { FaArrowUp } from "react-icons/fa"
import { debounce } from "lodash"
import { useUploadThing } from "@/lib/uploadthing"
import Button from "@/components/shared/Button"
import { VirtualTextarea } from "@/components/form/VirtualTextarea"
import type { PinDraft, DraftState } from "@/lib/types"
import { getErrorMessage } from "@/lib/utils"
import { deleteFiles } from "@/lib/actions/uploadthing.actions"
import { upsertDraft } from "@/lib/actions/user.actions"
import { useAppSelector } from "@/lib/store/hook"

/*
    When a user edits a draft, one request that updates the database will be sent. But the UI doesn't refresh.
*/
interface Props {
  getDraftList: () => void
  setDraftList: React.Dispatch<React.SetStateAction<PinDraft[]>>
  draftList: PinDraft[]
  currentDraft: PinDraft
  setCurrentDraft: React.Dispatch<React.SetStateAction<PinDraft>>
  publishDrafts: (drafts: PinDraft[]) => Promise<void>
}
export default function PinForm({
  getDraftList,
  setDraftList,
  draftList,
  currentDraft,
  setCurrentDraft,
  publishDrafts,
}: Props) {
  // Use Ref to provide newest state value to functions in closure
  const currentDraftRef = useRef(currentDraft)
  const draftListRef = useRef(draftList)
  useEffect(() => {
    currentDraftRef.current = currentDraft
  }, [currentDraft])
  useEffect(() => {
    draftListRef.current = draftList
  }, [draftList])

  // ---------------------------------------------------------------------- Auto-layout according to the content area's width
  const formDisplayContainerRef = useRef<HTMLDivElement>(null)
  const formDisplayDivRef = useRef<HTMLDivElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)
  const isInitialLoading = useRef(true) // when 'currentDraft' changes, this flag will be set to 'true' to avoid submitting
  /*
      When a user switches between two identical drafts (title, description and link are the same),
    the useEffect listening to form changes won't be triggered, which is unwanted (we need it to set 
    isInitialLoading.current). To prevent this special case, introduce prevDraft to compare with 
    currentDraft. If they are identical, set isInitialLoading.current to false.
  */
  const prevDraft = useRef<PinDraft>(currentDraft)

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
  }, [handleSrceenResize])

  // ---------------------------------------------------------------------- Draft State
  const [draftState, setDraftState] = useState<DraftState>("")
  useEffect(() => {
    setDraftState(currentDraft.state || "")
  }, [currentDraft.state])

  function handleDraftState(draftOnEdit: PinDraft, state: DraftState) {
    if (draftOnEdit._id === currentDraftRef.current._id) {
      setCurrentDraft({ ...draftOnEdit, state: state })
    }
    setDraftList((prev) => {
      return prev.map((item) => {
        if (item._id === draftOnEdit._id) {
          item.state = state
        }
        return item
      })
    })
  }

  // ---------------------------------------------------------------------- Form
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
    form.setValue("imageUrl", currentDraft?.imageUrl || "")
    form.setValue("description", currentDraft?.description || "")
    form.setValue("title", currentDraft?.title || "")
    form.setValue("link", currentDraft?.link || "")

    if (diffDrafts(prevDraft.current, currentDraft)) {
      isInitialLoading.current = true
    } else {
      isInitialLoading.current = false
    }

    setCurrentDraft({ ...currentDraft, prevImageUrl: currentDraft.imageUrl })
    prevDraft.current = currentDraft
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDraft._id])
  function diffDrafts(prev: PinDraft, next: PinDraft) {
    return prev.title !== next.title || prev.description !== next.description || prev.link !== next.link
  }

  // ---------------------------------------------------------------------- Listen to image changes
  const [files, setFiles] = useState<File[]>([])
  const filesRef = useRef(files)
  useEffect(() => {
    filesRef.current = files
  }, [files])
  function handleImage(e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) {
    e.preventDefault() // prevent browser reloading
    const fileReader = new FileReader()
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (!file.type.includes("image")) return

      setFiles(Array.from(e.target.files))

      fileReader.readAsDataURL(file)
      fileReader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          getImageSize({ ...currentDraft, imageUrl: e.target?.result })
        }
      }
    }
  }
  function handleClickImage() {
    uploadRef?.current?.click()
  }

  // ---------------------------------------------------------------------- Upload image to uploadthing
  const { startUpload } = useUploadThing("pin")
  function getImageSize(draftOnEdit: PinDraft) {
    const image = document.createElement("img")
    image.src = draftOnEdit.imageUrl
    image.onload = () => {
      draftOnEdit.imageSize = {
        width: image.width,
        height: image.height,
      }
      setCurrentDraft((prev) => {
        return {
          ...prev,
          imageSize: {
            width: image.width,
            height: image.height,
          },
        }
      })
      form.setValue("imageUrl", draftOnEdit.imageUrl)
      uploadImage(draftOnEdit)
    }
  }
  async function uploadImage(draftOnEdit: PinDraft) {
    if (draftOnEdit.isUnsaved) {
      handleDraftState(draftOnEdit, "Creating...")
      draftOnEdit.state = "Creating..."
      setDraftList((prev) => {
        return [draftOnEdit, ...prev]
      })
    } else {
      handleDraftState(draftOnEdit, "Saving...")
    }

    try {
      const imgResponse = await startUpload(filesRef.current)

      if (imgResponse && imgResponse[0].url) {
        draftOnEdit.imageUrl = imgResponse[0].url
        draftOnEdit.prevImageUrl && deleteImage(draftOnEdit.prevImageUrl)
        draftOnEdit.prevImageUrl = imgResponse[0].url
        submit(draftOnEdit)
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
    if (isInitialLoading.current) {
      isInitialLoading.current = false
      return
    }

    if (timer.current > 0) {
      clearTimeout(timer.current)
    }
    timer.current = window.setTimeout(() => {
      timer.current = 0
      /*
          Pass in the draft to guarantee that following manipulations and requests
        will only affect this draft even if 'currentDraft' changes.
      */
      const draftOnEdit = { ...currentDraft, title, description, link }
      submit(draftOnEdit)
    }, 300)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, link])

  // ---------------------------------------------------------------------- Submit form changes
  const user = useAppSelector((store) => store.user.user)
  async function submit(draftOnEdit: PinDraft) {
    if (!user) return

    const isValid = await form.trigger()
    if (!isValid) return

    handleDraftState(draftOnEdit, "Saving...")
    const res = await upsertDraft(user._id, draftOnEdit)

    handleDraftState(draftOnEdit, "")

    if (res && "errorMessage" in res) {
      toast.error(res.errorMessage)
      return
    }

    // if the draft is new created
    if (draftOnEdit.isUnsaved) {
      await getDraftList()
    }

    /*
      Rules about showing "Changes stored!":
        1. Show this message only when the moment draftA is saved, the user is still editing draftA
        2. When the user clicks another draft, remove this message
      So, only currentDraft needs to get "Changes stored!", drafts in draftList don't.
    */
    if (res._id === currentDraftRef.current._id) {
      setCurrentDraft({ ...res, state: "Changes stored!" })
      prevDraft.current = res
    }

    /*
        Save drafts changes by setDraftList instead of setCurrentDraft. Because the user may 
      be editing draftB while draftA is just saved.
    */
    setDraftList((prev) => {
      const index = prev.findIndex((item) => item._id === res._id)
      const newList = [...prev]
      newList.splice(index, 1, res)
      return newList
    })
  }

  return (
    <section className="flex-1 flex flex-col border-t main-content border-gray-bg-6">
      <div className="flex flex-none h-20 justify-between items-center px-[1.875rem]">
        <h4 className="font-medium text-lg">Create Pin</h4>
        <div className="loader"></div>
        <div className="flex items-center gap-3">
          <span className="text-gray-font-4">{draftState}</span>
          {imageUrl.length > 0 && (
            <Button
              text="Publish"
              bgColor="red"
              hover
              click={() => {
                publishDrafts([currentDraft])
              }}
            />
          )}
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
            <div
              className="flex-none w-[375px] min-h-[100px] max-h-[900px] cursor-pointer"
              onClick={handleClickImage}>
              <Image
                key={imageUrl}
                src={imageUrl}
                alt="uploaded image"
                className="object-contain rounded-[2rem] mx-auto max-w-[375px] bg-gray-bg-4"
                width={currentDraft.imageSize.width}
                height={currentDraft.imageSize.height}
                quality={100}
                sizes="375px"
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
                        className={`absolute z-[1] left-0 top-0 w-[375px] h-[453px] p-0 opacity-0 rounded-[2rem] cursor-pointer`}
                        onChange={(e) => handleImage(e, field.onChange)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="relative">
                {/* translucent cover layer */}
                {currentDraft.isUnsaved && <div className="absolute inset-0 z-10 bg-gray-tp-4"></div>}

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
                          placeholder={"Add a detailed description"}
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
