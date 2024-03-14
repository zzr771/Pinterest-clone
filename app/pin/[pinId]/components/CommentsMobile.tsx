import CommentCard from "@/components/cards/CommentCard"
import InputModal from "@/components/mobile/InputModal"
import Image from "next/image"
import { useState } from "react"
import { IoMdClose } from "react-icons/io"

interface Props {
  setshowCommentsMobile: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CommentsMobile({ setshowCommentsMobile }: Props) {
  const [showInputModal, setShowInputModal] = useState(false)

  function handleClickModal(event: React.MouseEvent<HTMLDivElement>) {
    if (event.currentTarget === event.target) {
      setshowCommentsMobile(false)
    }
  }
  return (
    <div className="fixed inset-0 bg-gray-tp-2 z-[10]" onClick={handleClickModal}>
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem]">
        {/* title */}
        <div className="flex justify-between items-center p-2">
          <div className="w-12 h-12 flex justify-center items-center">
            <IoMdClose className="w-6 h-6" />
          </div>
          <span className="font-medium text-xl">Comments</span>
          <div className="w-12"></div>
        </div>

        {/* comment list */}
        <div className="py-6 px-4 max-h-[70vh] overflow-y-auto">
          <CommentCard />
          <CommentCard />
          <CommentCard />
          <CommentCard />
        </div>

        {/* comment input */}
        <div className="flex gap-2 p-4 border-t border-gray-bg-1">
          <Image
            className="rounded-full object-cover"
            src={"/assets/test/avatar3.jpg"}
            alt="user avatar"
            width={48}
            height={48}
          />
          <div
            onClick={() => setShowInputModal(true)}
            className="w-[300px] h-12 px-4 rounded-full bg-gray-bg-4 leading-[3rem] text-gray-font-2 text-[15px]">
            Add a comment
          </div>
        </div>

        {showInputModal && <InputModal setShowInputModal={setShowInputModal} />}
      </div>
    </div>
  )
}
