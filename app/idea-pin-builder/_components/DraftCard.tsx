import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Checkbox } from "@/components/shadcn/checkbox"
import { PinDraft } from "@/lib/types"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "@/components/shared/Button"
import dynamic from "next/dynamic"
import { dialog } from "@/components/shared/Dialog"
const DropDownList = dynamic(() => import("@/components/shared/DropDownList"), { ssr: false })

interface Props {
  draft: PinDraft
  isEditing: boolean
  controlCheck?: boolean // Use this prop to control the checked state from PinDraftList
  setCurrentDraft: (draft: PinDraft) => void
  checkDraft: (isCheck: boolean, draft: PinDraft) => void
  handleDeleteDrafts: (drafts: PinDraft[]) => Promise<void>
  handleDuplicateDraft: (_id: string) => Promise<void>
}
export default function DraftCard({
  draft,
  isEditing = false,
  controlCheck = false,
  setCurrentDraft,
  checkDraft,
  handleDeleteDrafts,
  handleDuplicateDraft,
}: Props) {
  const [isChecked, setIsChecked] = useState(false)
  const options = [
    {
      label: "Duplicate",
      callback: async () => {
        handleDuplicateDraft(draft._id)
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
    const gap = draft.expiredAt - Date.now()
    return Math.ceil(gap / (1000 * 3600 * 24))
  }, [draft.expiredAt])

  function onCheckedChange(value: boolean) {
    setIsChecked(value)
    checkDraft(value, draft)
  }

  useEffect(() => {
    setIsChecked(controlCheck)
  }, [controlCheck])

  return (
    <div
      onClick={() => setCurrentDraft(draft)}
      className={`relative flex items-center gap-2 p-2 mb-1 border-[1px] hover-show-container rounded-lg hover:bg-gray-bg-5 ${
        isEditing ? "bg-gray-bg-5" : "border-transparent"
      }`}>
      {/* cover layer on create */}
      {draft.state === "Creating..." && <div className="absolute inset-0 rounded-2xl skeleton"></div>}
      {/* cover layer on publish */}
      {draft.state === "Publishing..." && (
        <div className="absolute inset-0 w-full h-full flex items-center rounded-lg bg-gray-tp-4">
          <div className="ml-12 upload-spinner"></div>
        </div>
      )}

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
        className="flex-none w-[72px] h-[72px] object-cover rounded-xl bg-gray-bg-4"
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
