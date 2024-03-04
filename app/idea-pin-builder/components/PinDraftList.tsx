import { useState } from "react"
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi"
import { FaPlus } from "react-icons/fa6"
import type { Draft } from "@/lib/types"
import Button from "@/components/shared/Button"
import DraftCard from "./DraftCard"
import BatchOperation from "./BatchOperation"

interface Props {
  draftList: Draft[]
  editingDraft: Draft
  setEditingDraft: (draft: Draft) => void
}

export default function PinDraftList({ draftList, editingDraft, setEditingDraft }: Props) {
  const [isFolded, setisFolded] = useState(false)
  const [checkedDrafts, setCheckedDrafts] = useState<Draft[]>([]) // store the _id of the checked drafts

  // select or unselect a draft
  function checkDraft(isCheck: boolean, draft: Draft) {
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
              Pin drafts <span className="font-normal">{"(3)"}</span>
            </h4>
          )}
          <Button hover clickEffect rounded click={() => setisFolded((prev) => !prev)}>
            {isFolded ? <FiChevronsRight className="h-7 w-7" /> : <FiChevronsLeft className="h-7 w-7" />}
          </Button>
        </div>
        {/* todo: disable this button while saving a new created draft */}
        {isFolded && (
          <Button hover clickEffect rounded>
            <FaPlus className="h-5 w-5" />
          </Button>
        )}
        {!isFolded && (
          <Button
            text="Create new"
            bgColor="gray"
            hover
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
                isEditing={editingDraft?._id === item._id}
                setEditingDraft={setEditingDraft}
                controlCheck={checkedDrafts.includes(item)}
                checkDraft={checkDraft}
              />
            ))}
          </div>

          {/* batch operation */}
          <BatchOperation
            draftList={draftList}
            checkedDrafts={checkedDrafts}
            checkAllDrafts={checkAllDrafts}
          />
        </>
      )}
    </section>
  )
}
