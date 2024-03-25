import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Checkbox } from "@/components/shadcn/checkbox"
import { Draft } from "@/lib/types"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "@/components/shared/Button"
import dynamic from "next/dynamic"
const DropDownList = dynamic(() => import("@/components/shared/DropDownList"), { ssr: false })

interface Props {
  draft: Draft
  isEditing: boolean
  controlCheck?: boolean // control whether the checkbox is checked from PinDraftList
  setEditingDraft: (draft: Draft) => void
  checkDraft: (isCheck: boolean, draft: Draft) => void
}
export default function DraftCard({
  draft,
  isEditing = false,
  controlCheck = false,
  setEditingDraft,
  checkDraft,
}: Props) {
  const [isChecked, setIsChecked] = useState(false)
  const options = useRef([{ label: "Duplicate" }, { label: "Delete" }])

  const daysRest = useMemo(() => {
    const gap = draft.expirationTime - new Date().getTime()
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
      onClick={() => setEditingDraft(draft)}
      className={`flex items-center gap-2 p-2 mb-1 border-[1px] hover-show-container rounded-lg hover:bg-gray-bg-5 ${
        isEditing ? "bg-gray-bg-5" : "border-transparent"
      }`}>
      <Checkbox
        checked={isChecked}
        onCheckedChange={onCheckedChange}
        className="flex-none border-2 border-gray-font-4 bg-white data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
      />
      <Image
        src={draft.image}
        alt="draft thumbnail"
        width={72}
        height={72}
        className="flex-none w-[72px] h-[72px] object-cover rounded-xl"
      />
      <div className="flex-1">
        {draft.title && <p className="font-semibold text-sm">{draft.title}</p>}
        <p className="text-[13px] text-gray-font-4">{`${daysRest} days until expiration`}</p>
      </div>

      <DropDownList options={options.current} position={{ offsetY: 40 }} followScrolling>
        <div className="w-8 h-8">
          <Button size="small" hover rounded clickEffect className="hover-content-flex hover:bg-gray-bg-7">
            <TfiMoreAlt />
          </Button>
        </div>
      </DropDownList>
    </div>
  )
}
