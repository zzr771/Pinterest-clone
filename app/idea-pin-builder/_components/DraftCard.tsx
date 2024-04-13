import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Checkbox } from "@/components/shadcn/checkbox"
import { PinDraft } from "@/lib/types"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "@/components/shared/Button"
import dynamic from "next/dynamic"
import { deleteDrafts, duplicateDraft } from "@/lib/actions/user.actions"
import { useAuth } from "@clerk/nextjs"
import toast from "react-hot-toast"
import { deleteFiles } from "@/lib/actions/uploadthing.actions"
import { dialog } from "@/components/shared/Dialog"
const DropDownList = dynamic(() => import("@/components/shared/DropDownList"), { ssr: false })

interface Props {
  draft: PinDraft
  isEditing: boolean
  controlCheck?: boolean // Use this prop to control the checked state from PinDraftList
  setDraftOnEdit: (draft: PinDraft) => void
  checkDraft: (isCheck: boolean, draft: PinDraft) => void
  getDraftList: () => void
  setIsCreatingDraft: React.Dispatch<React.SetStateAction<boolean>>
  handleDeleteDrafts: (drafts: PinDraft[]) => Promise<void>
}
export default function DraftCard({
  draft,
  isEditing = false,
  controlCheck = false,
  setDraftOnEdit,
  checkDraft,
  getDraftList,
  setIsCreatingDraft,
  handleDeleteDrafts,
}: Props) {
  const { userId } = useAuth()
  const [isChecked, setIsChecked] = useState(false)
  const options = [
    {
      label: "Duplicate",
      callback: async () => {
        if (!userId) return
        setIsCreatingDraft(true)
        const res = await duplicateDraft(userId, draft._id)
        if (res && "errorMessage" in res) {
          toast.error(res.errorMessage)
          return
        }
        await getDraftList()
        setIsCreatingDraft(false)
      },
    },
    {
      label: "Delete",
      callback: () => {
        dialog({
          title: "Delete your draft?",
          content: "You'll lose the edits you've made. This can't be undone!",
          confirmText: "Delete",
          cancelText: "Keep editing",
          confirmCallback: () => {
            handleDeleteDrafts([draft])
          },
        })
      },
    },
  ]

  const daysLeft = useMemo(() => {
    const gap = draft.expiredAt - new Date().getTime()
    return Math.ceil(gap / (1000 * 60 * 60 * 24))
  }, [])

  function onCheckedChange(value: boolean) {
    setIsChecked(value)
    checkDraft(value, draft)
  }

  useEffect(() => {
    setIsChecked(controlCheck)
  }, [controlCheck])

  return (
    <div
      onClick={() => setDraftOnEdit(draft)}
      className={`flex items-center gap-2 p-2 mb-1 border-[1px] hover-show-container rounded-lg hover:bg-gray-bg-5 ${
        isEditing ? "bg-gray-bg-5" : "border-transparent"
      }`}>
      <Checkbox
        checked={isChecked}
        onCheckedChange={onCheckedChange}
        className="flex-none border-2 border-gray-font-4 bg-white data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
      />
      <Image
        src={draft.imageUrl}
        alt="draft thumbnail"
        width={72}
        height={72}
        className="flex-none w-[72px] h-[72px] object-cover rounded-xl"
      />
      <div className="flex-1">
        {draft.title && <p className="font-semibold text-sm">{draft.title}</p>}
        <p className="text-[13px] text-gray-font-4">{`${daysLeft} days until expiration`}</p>
      </div>

      <DropDownList options={options} position={{ offsetY: 40 }} followScrolling>
        <div className="w-8 h-8">
          <Button size="small" hover rounded clickEffect className="hover-content-flex hover:bg-gray-bg-7">
            <TfiMoreAlt />
          </Button>
        </div>
      </DropDownList>
    </div>
  )
}
