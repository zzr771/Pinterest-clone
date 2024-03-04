import { useEffect, useRef, useState, ChangeEvent, useMemo } from "react"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form"
import { Input } from "@/components/shadcn/input"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { PinValidation } from "@/lib/validations/pin"

import { FaArrowUp } from "react-icons/fa"
import Button from "@/components/shared/Button"
import { Textarea } from "@/components/shadcn/textarea"
import { VirtualTextarea } from "@/components/form/VirtualTextarea"
import { uptime } from "process"

export default function PinForm() {
  const formDisplayContainerRef = useRef<HTMLDivElement>(null)
  const formDisplayDivRef = useRef<HTMLDivElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false) // Tip: Saving...
  const [showChangeTip, setShowChangeTip] = useState(false) // Tip: Changes stored!

  // auto-layout according to the content area width
  const handleSrceenResize = useMemo(() => {
    let timer = 0
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = window.setTimeout(() => {
        timer = 0
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
      }, 100)
    }
  }, [])
  useEffect(() => {
    if (!formDisplayContainerRef.current) return

    const resizeObserver = new ResizeObserver(handleSrceenResize)
    resizeObserver.observe(formDisplayContainerRef.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const form = useForm({
    resolver: zodResolver(PinValidation),
    defaultValues: {
      image: "",
      title: "",
      description: "",
      link: "",
    },
  })
  const image = form.watch("image")

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

  function handleClickImage() {
    uploadRef?.current?.click()
  }

  async function onSubmit(values: z.infer<typeof PinValidation>) {
    form.reset()
  }
  function handlePublish() {
    form.handleSubmit(onSubmit)()
  }

  return (
    <section className="flex-1 flex flex-col border-t main-content border-gray-bg-6">
      <div className="flex flex-none h-20 justify-between items-center px-[1.875rem]">
        <h4 className="font-medium text-lg">Create Pin</h4>
        <div className="flex items-center gap-3">
          {isSaving && <span className="text-gray-font-4">Saving...</span>}
          {showChangeTip && <span className="text-gray-font-4">Changes stored!</span>}
          {image.length > 0 && <Button text="Publish" bgColor="red" hover click={handlePublish} />}
        </div>
      </div>

      <div
        ref={formDisplayContainerRef}
        className="formDisplayContainerRef flex-1 flex justify-center border-t border-gray-bg-6 pt-6 overflow-y-auto">
        <div ref={formDisplayDivRef} className="flex flex-row gap-12 relative">
          {/* image upload part: just a div. A transparent <input type='file' /> overlaps covers it */}
          {image.length === 0 && (
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
                We recommend using high quality .jpg files less than 20MB.
              </div>
            </div>
          )}
          {image.length > 0 && (
            <div className="flex-none w-[375px] max-h-[900px] cursor-pointer" onClick={handleClickImage}>
              <img src={image} alt="uploaded image" className="object-contain rounded-[2rem]" />
            </div>
          )}

          {/* form part */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-none w-[584px]">
              {/* image upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className={`${image.length > 0 && "hidden"}`}>
                    <FormControl className="border-none bg-transparent">
                      <Input
                        ref={uploadRef}
                        type="file"
                        accept="image/*"
                        placeholder="654654"
                        className="absolute z-[1] left-0 top-0 w-[375px] h-[453px] opacity-0 p-0 rounded-[2rem] cursor-pointer"
                        onChange={(e) => handleImage(e, field.onChange)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-1 mb-5">
                    <FormLabel className="create-pin-label">Title</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="create-pin-input h-[49px] px-4 py-3"
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
                    <FormLabel className="create-pin-label">Description</FormLabel>
                    <FormControl>
                      <VirtualTextarea
                        className="create-pin-input p-4"
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
                    <FormLabel className="create-pin-label">Link</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="create-pin-input h-[49px] px-4 py-3"
                        placeholder="Add a link"
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
      </div>
    </section>
  )
}
