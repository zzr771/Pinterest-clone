import { useEffect, useRef, useState } from "react"
import { IoMdClose } from "react-icons/io"

interface Props {
  setShowInputModal: React.Dispatch<React.SetStateAction<boolean>>
  isComment?: boolean
}
export default function InputModal({ setShowInputModal, isComment = true }: Props) {
  const [input, setInput] = useState("")
  const [isInputValid, setIsInputValid] = useState(false)
  const placeHolderRef = useRef<HTMLDivElement>(null)
  const virtualTextAreaRef = useRef<HTMLDivElement>(null)

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const text = virtualTextAreaRef.current?.textContent || ""
    if (text.length >= 500 && event.key !== "Backspace") {
      event.preventDefault()
    }
  }
  function handleChange() {
    const text = virtualTextAreaRef.current?.textContent || ""
    setInput(text)
  }

  useEffect(() => {
    if (input.length > 0 && input.length <= 500) {
      setIsInputValid(true)
    } else {
      setIsInputValid(false)
    }
  }, [input])

  function handleClickModal(event: React.MouseEvent<HTMLDivElement>) {
    if (event.currentTarget === event.target) {
      setShowInputModal(false)
    }
  }
  return (
    <div className="fixed inset-0 bg-gray-tp-2 z-[20]" onClick={handleClickModal}>
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] text-base">
        {/* title */}
        <div className="flex justify-between items-center p-2">
          <div
            className="w-12 h-12 flex justify-center items-center"
            onClick={() => setShowInputModal(false)}>
            <IoMdClose className="w-6 h-6" />
          </div>
          {/* todo: username */}
          <span className="font-medium">{isComment ? "Add a comment" : "Reply to Kevin"}</span>
          <div className="w-12"></div>
        </div>

        {/* virtual textarea */}
        <div className="relative flex flex-col z-[1] mt-5 mx-7 min-h-[164px]">
          <div
            ref={placeHolderRef}
            className="placeholder absolute z-[-1] text-[#9CA3AF] text-[15px] font-normal">
            {input.length > 0
              ? ""
              : "Share what you like about this Pin, how it inspired you, or simply give a compliment"}
          </div>
          <div
            className="flex-1 text-gray-font-4 cursor-pointer focus:outline-none break-word"
            ref={virtualTextAreaRef}
            onKeyDown={handleKeyDown}
            onInput={handleChange}
            contentEditable></div>

          {/* character number & post */}
          <div className="flex justify-end items-center gap-3 my-3 mr-[-1rem]">
            <span className={`text-xs ${input.length > 500 ? "text-red" : ""}`}>{input.length}/500</span>
            <div
              className={`w-[3.75rem] h-8 rounded-full font-semibold text-sm text-center leading-8 ${
                isInputValid ? "bg-red text-white" : "bg-gray-bg-4 text-gray-font-4"
              }`}>
              Post
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
