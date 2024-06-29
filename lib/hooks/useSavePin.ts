import { useMutation } from "@apollo/client"
import { SAVE_PIN, UNSAVE_PIN } from "../apolloRequests/user.request"
import { useAppDispatch, useAppSelector } from "../store/hook"
import toast from "react-hot-toast"
import showMessageBox from "@/components/shared/showMessageBox"
import { handleApolloRequestError } from "../utils"
import { setUserSaved } from "../store/features/user"

export default function useSavePin() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((store) => store.user.user)
  const [savePinMutation] = useMutation(SAVE_PIN, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })
  const [unsavePinMutation] = useMutation(UNSAVE_PIN, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })

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

    if (!Array.isArray(res)) return
    showMessageBox({
      message: "Pin saved",
      button: {
        text: "Undo",
        callback: () => {
          unsavePin(pinId)
        },
      },
    })
    dispatch(setUserSaved(res))
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

    if (!Array.isArray(res)) return
    dispatch(setUserSaved(res))
  }

  return { savePin, unsavePin }
}
