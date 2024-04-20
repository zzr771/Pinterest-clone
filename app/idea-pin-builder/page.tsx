"use client"
import { useEffect, useState } from "react"
import PinDraftList from "./_components/PinDraftList"
import PinForm from "./_components/PinForm"
import type { PinDraft } from "@/lib/types"
import { fetchUserDrafts } from "@/lib/actions/user.actions"
import toast from "react-hot-toast"
import Dialog from "@/components/shared/Dialog"
import { useAppSelector } from "@/lib/store/hook"
import Loading from "@/components/shared/Loading"

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
        If draftA is successfully created, while draftB is still being created,
      replace draftA with the data from the server and preserve draftB (Because draft
      returned from the database doesn't have 'isUnsaved')
    */

    setDraftList((prev) => {
      let unsavedDrafts = prev.filter((item) => item.isUnsaved)
      // remove draftA (the newly created draft)
      unsavedDrafts = unsavedDrafts.filter((item) => !res.find((redDraft) => redDraft._id === item._id))
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

  return (
    <div className="flex mt-20 main-content">
      {isLoading && <Loading />}
      <PinDraftList
        draftList={draftList}
        setDraftList={setDraftList}
        getDraftList={getDraftList}
        currentDraft={currentDraft}
        setCurrentDraft={setCurrentDraft}
        genEmptyDraft={genEmptyDraft}
      />
      <PinForm
        getDraftList={getDraftList}
        setDraftList={setDraftList}
        draftList={draftList}
        currentDraft={currentDraft}
        setCurrentDraft={setCurrentDraft}
        genEmptyDraft={genEmptyDraft}
      />
      <Dialog />
    </div>
  )
}
