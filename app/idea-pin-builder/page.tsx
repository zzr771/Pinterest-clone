"use client"
import { useEffect, useRef, useState } from "react"
import PinDraftList from "./_components/PinDraftList"
import PinForm from "./_components/PinForm"
import type { DraftState, PinDraft } from "@/lib/types"
import { fetchUserDrafts } from "@/lib/actions/user.actions"
import toast from "react-hot-toast"
import Dialog from "@/components/shared/Dialog"
import { useAppSelector } from "@/lib/store/hook"
import Loading from "@/components/shared/Loading"
import { useRouter } from "next/navigation"
import { createPins } from "@/lib/actions/pin.actions"
import showMessageBox from "@/components/shared/showMessageBox"

/*
    To prevent too many unnecessary requests, a user's draftList will be fetched only during initial
  rendering and when draft list's length changes.
    When a user edits a draft, changes will be sent to the database, and the state 'draftList' will be 
  updated locally. So that the drafts in the database and in 'draftList' will be in sync.
*/
export default function Page() {
  const user = useAppSelector((store) => store.user.user)
  const [isLoading, setIsLoading] = useState(true)
  const [draftList, setDraftList] = useState<PinDraft[]>([])
  const [currentDraft, setCurrentDraft] = useState<PinDraft>(genEmptyDraft())

  async function getDraftList() {
    if (!user) return
    const res = await fetchUserDrafts(user._id)
    if (res && "errorMessage" in res) {
      toast.error(res.errorMessage)
      return
    }
    /*
        If draftA is successfully created, while draftB is still being created (request ongoing),
      replace draftA with the data from the server and preserve draftB (Because draft returned 
      from the database doesn't have 'isUnsaved')
    */
    setDraftList((prev) => {
      const unsavedDrafts = prev.filter((item) => {
        return item.isUnsaved && !res.find((redDraft) => redDraft._id === item._id)
      })
      // Keep the 'Publishing...' state of drafts that are being published
      res.forEach((item) => {
        const draftInPrev = prev.find((draft) => draft._id === item._id)
        if (draftInPrev && draftInPrev.state === "Publishing...") {
          item.state = draftInPrev.state
        }
      })
      return [...unsavedDrafts, ...res]
    })
  }

  useEffect(() => {
    async function init() {
      if (user) {
        await getDraftList()
        setIsLoading(false)
      }
    }
    init()
  }, [user])

  function genEmptyDraft() {
    return {
      _id: crypto.randomUUID(),
      imageUrl: "",
      title: "",
      description: "",
      link: "",
      expiredAt: Date.now() + 1000 * 3600 * 24 * 30,
      imageSize: { width: 375, height: 375 },
      state: "",
      isUnsaved: true,
    } as PinDraft
  }

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

  /*
    If currentDraft is about to be removed, set 'currentDraft' to the next remaining draft.
    If currentDraft and all following drafts are being removed, set 'currentDraft' to an empty draft.

    Invoke this function before updating draftList with request responses (for closure reason)
  */
  function calculateNextDraft(draftsToRemove: PinDraft[]) {
    let draftToSet = currentDraft
    if (draftsToRemove.find((item) => item._id === currentDraft._id)) {
      let index = draftList.findIndex((item) => item._id === currentDraft._id)

      if (index === draftList.length - 1) {
        draftToSet = genEmptyDraft()
      } else {
        // find a nearest draft that is not being removed
        while (index < draftList.length) {
          if (!draftsToRemove.find((item) => item._id === draftList[index]._id)) {
            draftToSet = draftList[index]

            break
          }
          index++
        }
        if (index === draftList.length) {
          draftToSet = genEmptyDraft()
        }
      }
    }
    return draftToSet
  }

  // ---------------------------------------------------------------------- Publish
  const currentDraftRef = useRef(currentDraft)
  const draftListRef = useRef(draftList)
  useEffect(() => {
    currentDraftRef.current = currentDraft
  }, [currentDraft])
  useEffect(() => {
    draftListRef.current = draftList
  }, [draftList])
  const router = useRouter()

  async function publishDrafts(draftsToPublish: PinDraft[]) {
    if (!user) return
    if (draftsToPublish.find((item) => item.state === "Saving...")) {
      toast("Please wait until the saving operation is completed.")
      return
    }

    // the newest data is in draftList, not currentDraft
    const targetDrafts = draftList.filter((item) => draftsToPublish.find((draft) => draft._id === item._id))
    if (targetDrafts.length === 0) return

    const draftToSet = calculateNextDraft(draftsToPublish)

    targetDrafts.forEach((item) => {
      handleDraftState(item, "Publishing...")
    })
    const res = await createPins(user._id, targetDrafts)
    if (res && "errorMessage" in res) {
      toast.error(res.errorMessage)
      return
    }

    await getDraftList()
    setCurrentDraft(draftToSet)

    // wait until draftList is updated
    setTimeout(() => {
      if (res.length > 1) {
        showMessageBox({
          message: "Your Pins has been published!",
        })
      } else {
        showMessageBox({
          message: "Your Pin has been published!",
          button: {
            text: "View",
            callback: () => {
              router.push(`/pin/${res[0]._id}`)
            },
          },
        })
      }
    })
  }

  return (
    <main className="flex mt-20 main-content">
      {isLoading && <Loading />}
      <PinDraftList
        draftList={draftList}
        setDraftList={setDraftList}
        getDraftList={getDraftList}
        currentDraft={currentDraft}
        setCurrentDraft={setCurrentDraft}
        genEmptyDraft={genEmptyDraft}
        calculateNextDraft={calculateNextDraft}
        publishDrafts={publishDrafts}
      />
      <PinForm
        getDraftList={getDraftList}
        setDraftList={setDraftList}
        draftList={draftList}
        currentDraft={currentDraft}
        setCurrentDraft={setCurrentDraft}
        publishDrafts={publishDrafts}
      />
      <Dialog />
    </main>
  )
}
