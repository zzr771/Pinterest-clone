"use client"
import dynamic from "next/dynamic"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import { TfiMoreAlt } from "react-icons/tfi"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import Button from "@/components/shared/Button"
import Paragraph from "@/components/shared/Paragraph"
import CommentCard from "@/components/cards/CommentCard"
import { reactionIcons } from "@/constants/index"
import Reaction from "@/components/shared/Reaction"
import Comment from "@/components/form/Comment"
import ToolTip from "@/components/shared/ToolTip"
import DropDownList from "@/components/shared/DropDownList"
import useDropDownList from "@/lib/hooks/useDropDownList"
const IntersectionMonitor = dynamic(() => import("@/components/mobile/IntersectionMonitor"), { ssr: false })
const ButtonsMobile = dynamic(() => import("./ButtonsMobile"))
const CommentsMobile = dynamic(() => import("./CommentsMobile"))

export default function Comments() {
  const [isMobileDevice, setIsMobileDevice] = useState(true)
  const [isCommentsFolded, setIsCommentsFolded] = useState(false)
  const options = useRef([
    { label: "Download image", callback: () => {} },
    { label: "Hide Pin", callback: () => {} },
    { label: "Delete Pin", callback: () => {} },
  ])

  const dropContainerRef = useRef<HTMLDivElement>(null)
  const [showDropDownList, setShowDropDownList] = useState(false)
  useDropDownList({ dropContainerRef, showDropDownList, setShowDropDownList })

  function foldComments() {
    setIsCommentsFolded(true)
  }
  function unfoldComments() {
    setIsCommentsFolded(false)
  }

  useLayoutEffect(() => {
    if (window.innerWidth >= 820) {
      setIsMobileDevice(false)
    }
  }, [])

  const [showCommentsMobile, setshowCommentsMobile] = useState(false)

  return (
    <div className="flex flex-col pin-image-width min-h-[205px] w5:min-h-[592px] w5:max-h-[902px] w3:max-w5:rounded-b-[2rem] w5:rounded-r-[2rem]">
      <div className="relative flex flex-col flex-1 w3:pl-8 pl-4">
        {/* top bar */}
        {!isMobileDevice && (
          <div className="flex justify-between h-[3.75rem] pt-8 pr-8 box-content bg-white w3:max-w5:rounded-0 w5:rounded-tr-[2rem] sticky top-[64px] z-[5]">
            <div ref={dropContainerRef} className="flex items-center relative ml-[-12px] ">
              <ToolTip text="More options">
                <Button
                  rounded
                  hover
                  clickEffect
                  click={() => setShowDropDownList((prev) => !prev)}
                  bgColor={showDropDownList ? "black" : "transparent"}>
                  <TfiMoreAlt className="w-5 h-5" />
                </Button>
              </ToolTip>
              {showDropDownList && (
                <div className="horizontal-middle top-[62px]">
                  <DropDownList options={options.current} />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <Button text="Save" bgColor="red" hover />
            </div>
          </div>
        )}

        {/* 323px: total height of navBarTop(80), top bar(92), comment input(151) */}
        {/* 659px: max-height(902) - top bar(92) - comment input(151) */}
        <div className="flex flex-col flex-1 max-h-[calc(100vh-323px)] w5:max-h-[659px] overflow-y-auto w3:pr-8 pr-4">
          {/* link */}
          {!isMobileDevice && (
            <a target="_black" className="underline cursor-pointer">
              {"flick.com"}
            </a>
          )}

          {/* title & description */}
          <div className="mt-3 max-w3:order-2">
            <h2 className="font-medium text-[28px]">{"Life in the Alps"}</h2>
            <div className="py-3">
              <Paragraph
                maxLines={3}
                text={
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente veniam, obcaecati pariatur odit illum, inventore qui voluptates exercitationem nam perspiciatis debitis laboriosam doloribus ab nulla itaque. Aperiam eius nobis eveniet."
                }
                className="leading-[1.4]"
              />
            </div>
          </div>

          {/* author */}
          <div className="flex max-w3:order-1 justify-between mt-[1.1rem]">
            <div className="flex">
              <Image
                src="/assets/test/avatar2.jpg"
                width={48}
                height={48}
                alt="avatar"
                className="rounded-full mr-1 object-cover"
              />
              <div className="flex flex-col justify-center px-1 text-sm">
                <span className="font-medium">{"John Doe"}</span>
                <span>{"3.1k followers"}</span>
              </div>
            </div>
            <Button text="Follow" bgColor="gray" hover clickEffect />
          </div>

          {/* comments */}
          {!isMobileDevice && (
            <div className="mt-[4rem]">
              <div className="flex items-center justify-between pr-4">
                <h3 className="font-medium my-3">Comments</h3>
                {isCommentsFolded ? (
                  <FaChevronDown onClick={unfoldComments} className="cursor-pointer w-[1.1rem] h-[1.1rem]" />
                ) : (
                  <FaChevronUp onClick={foldComments} className="cursor-pointer w-[1.1rem] h-[1.1rem]" />
                )}
              </div>
              {/* max-h-0: prvent the expanded comments from stretching the whole component which will influence the layout */}
              <div className={`${isCommentsFolded ? "hidden" : ""} flex flex-col max-h-0`}>
                <CommentCard />
                <CommentCard />
                <CommentCard />
                <CommentCard />
                <CommentCard />
                <CommentCard />
                <div className="py-4"></div>
              </div>
            </div>
          )}
        </div>

        {isMobileDevice && <ButtonsMobile setshowCommentsMobile={setshowCommentsMobile} />}

        {/* monitor the screen scrolling position and control the position method of ButtonsForMobile */}
        {isMobileDevice && (
          <div className="absolute z-[-1] bottom-0">
            {/* h-20: the height of ButtonsForMobile */}
            <div className="h-16"></div>
            <IntersectionMonitor name="NavBarBottom" />
          </div>
        )}
      </div>

      {/* comment input */}
      {!isMobileDevice && (
        <div className="border-top sticky bottom-0 z-[4] py-2 px-8 bg-white w3:max-w5:rounded-b-[2rem] w5:rounded-br-[2rem]">
          <div className="flex justify-between items-center mt-1 mb-3">
            {/* No comment: What do you think? */}
            <span className="font-medium text-xl">7 Comments</span>
            <div className="flex items-center gap-3">
              <div className="flex gap-1 cursor-pointer">
                <div
                  style={{ backgroundImage: `url(${reactionIcons[0].src})` }}
                  className="h-5 w-5 bg-no-repeat bg-cover"></div>
                {"21"}
              </div>
              <Reaction />
            </div>
          </div>
          <Comment />
        </div>
      )}

      {isMobileDevice && showCommentsMobile && (
        <CommentsMobile setshowCommentsMobile={setshowCommentsMobile} />
      )}
    </div>
  )
}
