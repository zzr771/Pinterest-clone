import { FaMinus } from "react-icons/fa"
import { IoMdTrash } from "react-icons/io"
import { Checkbox } from "@/components/shadcn/checkbox"
import type { PinDraft } from "@/lib/types"
import Button from "@/components/shared/Button"
import { useAuth } from "@clerk/nextjs"
import { dialog } from "@/components/shared/Dialog"

interface Props {
  draftList: PinDraft[]
  checkedDrafts: PinDraft[]
  setCheckedDrafts: React.Dispatch<React.SetStateAction<PinDraft[]>>
  checkAllDrafts: (isAll: boolean) => void
  handleDeleteDrafts: (drafts: PinDraft[]) => Promise<void>
}

export default function BatchOperation({
  draftList,
  checkedDrafts,
  setCheckedDrafts,
  checkAllDrafts,
  handleDeleteDrafts,
}: Props) {
  const { userId } = useAuth()

  function handleDeleteCheckedDrafts() {
    dialog({
      title: "Delete your drafts?",
      content: "You'll lose the edits you've made. This can't be undone!",
      confirmText: "Delete",
      cancelText: "Keep editing",
      confirmCallback: deleteCheckedDrafts,
    })
  }
  async function deleteCheckedDrafts() {
    await handleDeleteDrafts(checkedDrafts)
    setCheckedDrafts([])
  }

  return (
    <div className="h-[4.5rem] border-t border-gray-bg-6 p-4">
      {checkedDrafts.length === 0 ? (
        <div className="h-full flex items-center gap-2">
          <Checkbox
            onCheckedChange={() => checkAllDrafts(true)}
            className="h-6 w-6 rounded-lg border-2 border-gray-font-4 bg-white data-[state=checked]:border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
          />
          <span className="text-[15px]">Select all</span>
        </div>
      ) : (
        <div className="h-full flex items-center justify-between">
          {/* number */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center h-6 w-6 rounded-lg bg-black cursor-pointer"
              onClick={() => checkAllDrafts(false)}>
              <FaMinus className="text-white w-3 h-3" />
            </div>
            <div>
              {checkedDrafts.length} of {draftList.length}
            </div>
          </div>

          {/* batch button */}
          <div className="flex items-center gap-2">
            <Button hover rounded clickEffect className="!w-10 !h-10" click={handleDeleteCheckedDrafts}>
              <IoMdTrash className="w-6 h-6" />
            </Button>
            <Button text="Publish" bgColor="red" className="!h-10 text-[15px] !px-3" />
          </div>
        </div>
      )}
    </div>
  )
}
