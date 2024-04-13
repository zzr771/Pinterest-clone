"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import PinDraftList from "./_components/PinDraftList"
import PinForm from "./_components/PinForm"
import type { PinDraft } from "@/lib/types"
import { fetchUserDrafts } from "@/lib/actions/user.actions"
import toast from "react-hot-toast"
import Dialog from "@/components/shared/Dialog"

/*
    To prevent too many unnecessary requests, a user's draftList will be fetched only during initial
  rendering and when draft list's length changes.
    When a user edits a draft, changes will be sent to the database, and the state 'draftList' will be 
  updated locally. So that the drafts in the database and in 'draftList' will be in sync.
*/
export default function Page() {
  const { userId, isSignedIn } = useAuth()
  const [isCreatingDraft, setIsCreatingDraft] = useState(false)
  const [draftList, setDraftList] = useState<PinDraft[]>([])
  const [draftOnEdit, setDraftOnEdit] = useState<PinDraft>({
    _id: crypto.randomUUID(),
    imageUrl: "",
    title: "",
    description: "",
    link: "",
    expiredAt: 0,
    imageSize: { width: 0, height: 0 },
  })

  async function getDraftList() {
    if (!userId) return
    const res = await fetchUserDrafts(userId)
    if (res && "errorMessage" in res) {
      toast.error(res.errorMessage)
      return
    }
    setDraftList(res)
  }
  useEffect(() => {
    if (isSignedIn) {
      getDraftList()
    }
  }, [isSignedIn])

  return (
    <div className="flex mt-20 main-content">
      <PinDraftList
        draftList={draftList}
        draftOnEdit={draftOnEdit}
        setDraftOnEdit={setDraftOnEdit}
        isCreatingDraft={isCreatingDraft}
        setIsCreatingDraft={setIsCreatingDraft}
        getDraftList={getDraftList}
      />
      <PinForm
        setDraftList={setDraftList}
        draftOnEdit={draftOnEdit}
        setDraftOnEdit={setDraftOnEdit}
        isCreatingDraft={isCreatingDraft}
        setIsCreatingDraft={setIsCreatingDraft}
        getDraftList={getDraftList}
      />
      <Dialog />
    </div>
  )
}
