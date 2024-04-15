import { useState } from "react"
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi"
import { FaPlus } from "react-icons/fa6"
import type { PinDraft } from "@/lib/types"
import Button from "@/components/shared/Button"
import DraftCard from "./DraftCard"
import BatchOperation from "./BatchOperation"
import { useAuth } from "@clerk/nextjs"
import { deleteDrafts } from "@/lib/actions/user.actions"
import toast from "react-hot-toast"
import { getErrorMessage } from "@/lib/utils"
import { deleteFiles } from "@/lib/actions/uploadthing.actions"

interface Props {
  draftList: PinDraft[]
  currentDraft: PinDraft
  setCurrentDraft: React.Dispatch<React.SetStateAction<PinDraft>>
  isCreatingDraft: boolean
  setIsCreatingDraft: React.Dispatch<React.SetStateAction<boolean>>
  getDraftList: () => void
}

export default function PinDraftList({
  draftList,
  currentDraft,
  setCurrentDraft,
  isCreatingDraft,
  setIsCreatingDraft,
  getDraftList,
}: Props) {
  const [isFolded, setisFolded] = useState(false)
  const [checkedDrafts, setCheckedDrafts] = useState<PinDraft[]>([]) // drafts that are currently checked
  const { userId } = useAuth()

  function createEmptyDraft() {
    // If there is an empty draft already.
    if (!currentDraft.imageUrl) return

    setCurrentDraft(getEmptyDraft())
  }

  function getEmptyDraft() {
    return {
      _id: crypto.randomUUID(),
      imageUrl: "",
      title: "",
      description: "",
      link: "",
      expiredAt: 0,
      imageSize: { width: 0, height: 0 },
    }
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
    if (isAll) {
      setCheckedDrafts(draftList)
    } else {
      setCheckedDrafts([])
    }
  }

  async function handleDeleteDrafts(draftsToDelete: PinDraft[]) {
    /*
        If currentDraft is being deleted, set state 'currentDraft' to the next remaining draft.
        If currentDraft and all drafts after it are being deleted, set state 'currentDraft' to an empty draft.
    */
    let draftToSet = currentDraft
    if (draftsToDelete.find((item) => item._id === draftToSet._id)) {
      let index = draftList.findIndex((item) => item._id === draftToSet._id)

      if (index === draftList.length - 1) {
        draftToSet = getEmptyDraft()
      } else {
        while (index < draftList.length) {
          if (!draftsToDelete.includes(draftList[index])) {
            draftToSet = draftList[index]
            break
          }
          index++
        }
        if (index === draftList.length) {
          draftToSet = getEmptyDraft()
        }
      }
    }

    if (!userId) return
    const draftIds = draftsToDelete.map((draft) => draft._id)
    const res = await deleteDrafts(userId, draftIds)
    if (res && "errorMessage" in res) {
      toast.error(getErrorMessage(res))
      return
    }

    setCurrentDraft(draftToSet)
    getDraftList()
    deleteImages(draftsToDelete)
  }

  async function deleteImages(drafts: PinDraft[]) {
    let imageUrls = drafts.map((draft) => draft.imageUrl)
    imageUrls = [...new Set(imageUrls)]
    const res = await deleteFiles(imageUrls)
    if (res && "errorMessage" in res) {
      toast.error(res.errorMessage)
    }
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
        {/* todo: disable this button while saving a new created draft */}
        {isFolded && (
          <Button hover clickEffect rounded disabled={isCreatingDraft} click={createEmptyDraft}>
            <FaPlus className="h-5 w-5" />
          </Button>
        )}
        {!isFolded && (
          <Button
            text="Create new"
            bgColor="gray"
            hover
            disabled={isCreatingDraft}
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
            {isCreatingDraft && <div className="h-[88px] rounded-2xl skeleton"></div>}
            {draftList.map((item) => (
              <DraftCard
                key={item._id}
                draft={item}
                isEditing={currentDraft?._id === item._id}
                setCurrentDraft={setCurrentDraft}
                controlCheck={checkedDrafts.includes(item)}
                checkDraft={checkDraft}
                getDraftList={getDraftList}
                setIsCreatingDraft={setIsCreatingDraft}
                handleDeleteDrafts={handleDeleteDrafts}
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
          />
        </>
      )}
    </section>
  )
}
