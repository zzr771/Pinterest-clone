import { useState } from "react"
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi"
import { FaPlus } from "react-icons/fa6"
import type { PinDraft } from "@/lib/types"
import Button from "@/components/shared/Button"
import DraftCard from "./DraftCard"
import BatchOperation from "./BatchOperation"
import { deleteDrafts, duplicateDraft } from "@/lib/actions/user.actions"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/utils"
import { deleteFiles } from "@/lib/actions/uploadthing.actions"
import { useAppSelector } from "@/lib/store/hook"

interface Props {
  draftList: PinDraft[]
  getDraftList: () => void
  setDraftList: React.Dispatch<React.SetStateAction<PinDraft[]>>
  currentDraft: PinDraft
  setCurrentDraft: React.Dispatch<React.SetStateAction<PinDraft>>
  genEmptyDraft: () => PinDraft
  calculateNextDraft: (drafs: PinDraft[]) => PinDraft
  publishDrafts: (drafts: PinDraft[]) => Promise<void>
}

export default function PinDraftList({
  draftList,
  getDraftList,
  setDraftList,
  currentDraft,
  setCurrentDraft,
  genEmptyDraft,
  calculateNextDraft,
  publishDrafts,
}: Props) {
  const [isFolded, setisFolded] = useState(false)
  const [checkedDrafts, setCheckedDrafts] = useState<PinDraft[]>([]) // drafts that are currently checked
  const user = useAppSelector((store) => store.user.user)

  function createEmptyDraft() {
    if (draftList.length >= 50) {
      toast("Maximum number of drafts: 50.")
      return
    }

    // If there is an empty draft already.
    if (!currentDraft.imageUrl) return

    setCurrentDraft(genEmptyDraft())
  }

  // select or unselect a draft
  function checkDraft(isCheck: boolean, draft: PinDraft) {
    if (isCheck) {
      setCheckedDrafts((prev) => {
        return [...prev, draft]
      })
    } else {
      setCheckedDrafts((prev) => {
        return prev.filter((item) => item._id !== draft._id)
      })
    }
  }

  // select or unselect all drafts
  function checkAllDrafts(isAll: boolean) {
    if (isAll && draftList.length > 0) {
      setCheckedDrafts(draftList)
    } else {
      setCheckedDrafts([])
    }
  }

  async function handleDeleteDrafts(draftsToDelete: PinDraft[]) {
    if (!user) return

    const draftToSet = calculateNextDraft(draftsToDelete)

    const draftIds = draftsToDelete.map((draft) => draft._id)
    const res = await deleteDrafts(user._id, draftIds)
    if (res && "errorMessage" in res) {
      toast.error(getErrorMessage(res))
      return
    }

    setCurrentDraft(draftToSet)
    getDraftList()
    deleteImages(draftsToDelete)
  }

  async function deleteImages(draftsToDelete: PinDraft[]) {
    let imageUrls = draftsToDelete.map((draft) => draft.imageUrl)
    imageUrls = [...new Set(imageUrls)]
    const res = await deleteFiles(imageUrls)
    if (res && "errorMessage" in res) {
      toast.error(res.errorMessage)
    }
  }

  async function handleDuplicateDraft(originalDraftId: string) {
    if (draftList.length >= 50) {
      toast("Maximum number of drafts: 50.")
      return
    }
    if (!user) return

    const newDraft = genEmptyDraft()
    newDraft.state = "Creating..."
    setDraftList((prev) => [newDraft, ...prev])

    const res = await duplicateDraft(user._id, originalDraftId, newDraft._id)
    if (res && "errorMessage" in res) {
      toast.error(res.errorMessage)
      return
    }
    await getDraftList()
  }

  return (
    <section
      className={`flex-none flex flex-col main-content border border-gray-bg-6 border-b-0 ${
        isFolded ? "w-[82px]" : "w-[351px]"
      }`}>
      {/* buttons */}
      <div className="px-4">
        <div className="flex items-center justify-between my-4">
          {!isFolded && (
            <h4 className="font-medium text-lg">
              Pin drafts <span className="font-normal">{`(${draftList.length})`}</span>
            </h4>
          )}
          <Button hover clickEffect rounded click={() => setisFolded((prev) => !prev)}>
            {isFolded ? <FiChevronsRight className="h-7 w-7" /> : <FiChevronsLeft className="h-7 w-7" />}
          </Button>
        </div>
        {isFolded && (
          <Button hover clickEffect rounded click={createEmptyDraft}>
            <FaPlus className="h-5 w-5" />
          </Button>
        )}
        {!isFolded && (
          <Button
            text="Create new"
            bgColor="gray"
            hover
            click={createEmptyDraft}
            className="!h-10 px-3 py-2 w-full font-medium !text-[15px] active:scale-[98%] transition"
          />
        )}
      </div>

      {/* dividing line */}
      <div className="h-[1px] bg-gray-bg-6 my-4"></div>

      {!isFolded && (
        <>
          {/* card list */}
          <div className="relative flex-1 p-2 overflow-y-auto overflow-x-hidden">
            {draftList.map((item) => (
              <DraftCard
                key={item._id}
                draft={item}
                isEditing={currentDraft?._id === item._id}
                setCurrentDraft={setCurrentDraft}
                controlCheck={checkedDrafts.includes(item)}
                checkDraft={checkDraft}
                handleDeleteDrafts={handleDeleteDrafts}
                handleDuplicateDraft={handleDuplicateDraft}
              />
            ))}
          </div>

          {/* batch operation */}
          <BatchOperation
            draftList={draftList}
            checkedDrafts={checkedDrafts}
            setCheckedDrafts={setCheckedDrafts}
            checkAllDrafts={checkAllDrafts}
            handleDeleteDrafts={handleDeleteDrafts}
            publishDrafts={publishDrafts}
          />
        </>
      )}
    </section>
  )
}
