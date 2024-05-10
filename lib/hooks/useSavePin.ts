import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { SAVE_PIN, UNSAVE_PIN } from "../apolloRequests/user.request"
import { useAppSelector } from "../store/hook"
import toast from "react-hot-toast"
import showMessageBox from "@/components/shared/showMessageBox"

export default function useSavePin(isSavedInitial: boolean) {
  const user = useAppSelector((store) => store.user.user)
  const [isSaved, setIsSaved] = useState(isSavedInitial)
  const [savePinMutation] = useMutation(SAVE_PIN)
  const [unsavePinMutation] = useMutation(UNSAVE_PIN)

  useEffect(() => {
    if (isSavedInitial) {
      setIsSaved(isSavedInitial)
    }
  }, [isSavedInitial])

  async function savePin(pinId: string) {
    if (!user) {
      toast("Please sign in before operation")
      return
    }

    const {
      data: { savePin: res },
    } = await savePinMutation({
      variables: {
        userId: user._id,
        pinId,
      },
    })
    if (res.success) {
      showMessageBox({
        message: "Pin saved",
        button: {
          text: "Undo",
          callback: () => {
            unsavePin(pinId)
          },
        },
      })
      setIsSaved(true)
    } else {
      toast.error(res.message)
    }
  }
  async function unsavePin(pinId: string) {
    if (!user) {
      toast("Please sign in before operation")
      return
    }

    const {
      data: { unsavePin: res },
    } = await unsavePinMutation({
      variables: {
        userId: user._id,
        pinId,
      },
    })
    if (res.success) {
      setIsSaved(false)
    } else {
      toast.error(res.message)
    }
  }

  return { isSaved, savePin, unsavePin }
}
