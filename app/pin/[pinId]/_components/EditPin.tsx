import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form"
import { Input } from "@/components/shadcn/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { PinEditValidation } from "@/lib/validations/pinEdit"
import { VirtualTextarea } from "@/components/form/VirtualTextarea"

import { PinInfoBasic } from "@/lib/types"
import { IoMdClose } from "react-icons/io"
import Button from "@/components/shared/Button"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hook"
import { setShowEditPinForm } from "@/lib/store/features/modal"
import { useMutation } from "@apollo/client"
import { UPDATE_PIN } from "@/lib/apolloRequests/pin.request"
import { handleApolloRequestError } from "@/lib/utils"
import { setPinInfo } from "@/lib/store/features/pinInfo"

const FORM_FIELDS = ["title", "description", "link"]
type Keys = keyof PinInfoBasic
export default function EditForm() {
  const dispatch = useAppDispatch()
  const [allowSave, setAllowSave] = useState(false)
  const pinInfoInStore = useAppSelector((store) => store.pinInfo.pinInfo)
  const pin = {
    _id: pinInfoInStore._id,
    title: pinInfoInStore.title,
    description: pinInfoInStore.description,
    link: pinInfoInStore.link,
  }

  const form = useForm({
    resolver: zodResolver(PinEditValidation),
    defaultValues: pin,
  })

  const [title, description, link] = form.watch(["title", "description", "link"])
  useEffect(() => {
    form.trigger().then((result) => {
      if (result && checkValuesChange()) {
        setAllowSave(true)
      } else {
        setAllowSave(false)
      }
    })
  }, [title, description, link])

  function checkValuesChange() {
    let haveValuesChanged = false
    Object.entries(pin).forEach(([key, value]) => {
      if (!haveValuesChanged && FORM_FIELDS.includes(key) && form.getValues(key as Keys) !== value) {
        haveValuesChanged = true
        return
      }
    })
    return haveValuesChanged
  }

  const [updatePinMutation] = useMutation(UPDATE_PIN, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })
  async function updatePin() {
    const { title, description, link } = form.getValues()
    const {
      data: { updatePin: res },
    } = await updatePinMutation({
      variables: {
        pin: {
          _id: pin._id,
          title,
          description,
          link,
        },
      },
    })
    dispatch(setShowEditPinForm(false))
    dispatch(setPinInfo({ ...pinInfoInStore, ...res }))
  }

  return (
    <div className="flex flex-col h-screen">
      <h2 className="flex items-center justify-between h-24 py-7 px-6 shadow-small">
        <span className="font-medium text-[28px]">Edit Pin</span>
        <IoMdClose className="w-8 h-8 cursor-pointer" onClick={() => dispatch(setShowEditPinForm(false))} />
      </h2>

      <div className="flex-1 p-6 overflow-y-auto">
        <Form {...form}>
          <form>
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
          </form>
        </Form>
      </div>

      <div className="flex items-center justify-end gap-2 p-6 h-24 shadow-small">
        <Button text="Delete" bgColor="gray" hover clickEffect />
        <Button
          text="Save"
          hover
          clickEffect
          disabled={!allowSave}
          bgColor={allowSave ? "red" : "gray"}
          className={allowSave ? "text-white" : "text-gray-font-4"}
          click={updatePin}
        />
      </div>
    </div>
  )
}
