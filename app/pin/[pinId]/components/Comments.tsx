"use client"
import { useRef, useState } from "react"
import Image from "next/image"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "@/components/shared/Button"
import ToolTip from "@/components/shared/ToolTip"
import Paragraph from "@/components/shared/Paragraph"
import DropDownList from "@/components/shared/DropDownList"
import CommentCard from "@/components/cards/CommentCard"

export default function Comments() {
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [isCommentsFolded, setIsCommentsFolded] = useState(false)

  const options = useRef([
    { label: "Download image", callback: () => {} },
    { label: "Hide Pin", callback: () => {} },
  ])

  function foldComments() {
    setIsCommentsFolded(true)
  }
  function unfoldComments() {
    setIsCommentsFolded(false)
  }

  return (
    <div className="h-full flex flex-col max-h-[902px]">
      <div className="flex flex-col flex-1 pl-8">
        {/* top bar */}
        <div className="flex justify-between h-[3.75rem] pt-8 pr-8 box-content bg-white rounded-tr-[2rem] sticky top-[64px] z-2">
          <div className="flex items-center ml-[-12px] relative">
            <ToolTip text="More options" position="bottom">
              <Button
                rounded
                hover
                clickEffect
                click={() => setShowMoreOptions((prev) => !prev)}
                bgColor={showMoreOptions ? "black" : "transparent"}>
                <TfiMoreAlt className="w-5 h-5" />
              </Button>
            </ToolTip>
            {showMoreOptions && (
              <div className="horizontal-middle top-[62px]">
                <DropDownList options={options.current} />
              </div>
            )}
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-2 pr-4">
              <span className="font-medium">Profile</span>
              <FaChevronDown className="cursor-pointer w-3.5 h-3.5" />
            </div>
            <Button text="Save" bgColor="red" hover />
          </div>
        </div>

        <div className="flex-1 overflow-auto pr-8">
          {/* link */}
          <a target="_black" className="underline cursor-pointer">
            {"flick.com"}
          </a>

          {/* title & description */}
          <div className="mt-3">
            <h2 className="font-medium text-[28px]">{"Life in the Alps"}</h2>
            <div className="py-3">
              <Paragraph
                maxLines={3}
                text={
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente veniam, obcaecati pariatur odit illum, inventore qui voluptates exercitationem nam perspiciatis debitis laboriosam doloribus ab nulla itaque. Aperiam eius nobis eveniet."
                }
              />
            </div>
          </div>

          {/* author */}
          <div className="flex justify-between mt-[1.1rem]">
            <div className="flex">
              <Image
                src="/assets/test/avatar2.jpg"
                width={48}
                height={48}
                alt="avatar"
                className="rounded-full mr-1"
              />
              <div className="flex flex-col justify-center px-1 text-sm">
                <span className="font-medium">{"John Doe"}</span>
                <span>{"3.1k followers"}</span>
              </div>
            </div>
            <Button text="Follow" bgColor="gray" hover clickEffect />
          </div>

          {/* comments */}
          <div className="mt-[4.5rem]">
            <div className="flex items-center justify-between pr-4">
              <h3 className="font-medium my-3">Comments</h3>
              {isCommentsFolded ? (
                <FaChevronDown onClick={unfoldComments} className="cursor-pointer w-[1.1rem] h-[1.1rem]" />
              ) : (
                <FaChevronUp onClick={foldComments} className="cursor-pointer w-[1.1rem] h-[1.1rem]" />
              )}
            </div>
            <div className={`${isCommentsFolded ? "hidden" : ""} flex flex-col max-h-0`}>
              <CommentCard />
              <CommentCard />
              <CommentCard />
              <div className="py-4"></div>
            </div>
          </div>
        </div>
      </div>

      {/* input */}
      {/* No comment: What do you think? */}
      <div className="border-top h-[144px] sticky bottom-0 z-1 py-2 px-8 bg-white">
        <div className="flex justify-between items-center mt-1 mb-3">
          <span className="font-medium text-xl">7 Comments</span>
          <div className="flex items-center gap-3">
            <div className="reaction"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
