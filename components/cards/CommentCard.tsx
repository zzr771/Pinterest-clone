"use client"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { HiOutlineHeart } from "react-icons/hi"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "../shared/Button"
import dynamic from "next/dynamic"
const OptionListMobile = dynamic(() => import("../mobile/OptionListMobile"), { ssr: false })
const DropDownList = dynamic(() => import("@/components/shared/DropDownList"), { ssr: false })
import Reply from "../form/Reply"
import InputModal from "../mobile/InputModal"
import { CommentInfo } from "@/lib/types"
import { useAppSelector } from "@/lib/store/hook"

export default function CommentCard({ comment }: { comment: CommentInfo }) {
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false) // PC
  const [showInputModal, setShowInputModal] = useState(false) // mobile
  const authorOptions = useRef([{ label: "Edit" }, { label: "Delete" }])

  const { author, content, likes, replies, replyToUser, createdAt } = comment
  const user = useAppSelector((store) => store.user.user)
  const isAuthor = author._id === user?._id

  useEffect(() => {
    if (window.innerWidth < 820) {
      setIsMobileDevice(true)
    } else {
      setIsMobileDevice(false)
    }
  }, [])

  function handleClick() {
    setShowReplyInput((prev) => !prev)
    setShowInputModal(true)
  }

  return (
    <div className="my-2.5">
      <div className="flex">
        {/* avatar image */}
        <div className="min-w-8 mr-2">
          <Image
            src="/assets/test/avatar2.jpg"
            width={32}
            height={32}
            alt="user avatar"
            className="rounded-full object-cover"
          />
        </div>

        <div>
          {/* main content */}
          <p>
            {/* user name */}
            <a className="font-semibold mr-1 hover:underline cursor-pointer">{author.firstName}</a>
            {content}
          </p>

          {/* buttons */}
          <div className="flex text-gray-font-4 gap-5 text-sm">
            <div>13d</div>
            <div className="font-medium cursor-pointer" onClick={() => handleClick()}>
              Reply
            </div>
            <div className="flex items-center font-medium gap-1">
              <HiOutlineHeart className="w-5 h-5 cursor-pointer" />
              {likes}
            </div>
            {/* show this button if the current user is the author of the comment */}
            <div className="relative">
              {isAuthor && !isMobileDevice && (
                <DropDownList
                  options={authorOptions.current}
                  position={{ offsetY: 30 }}
                  followScrolling
                  className="z-[1]">
                  <Button size="tiny" clickEffect hover rounded>
                    <TfiMoreAlt className="text-gray-font-4" />
                  </Button>
                </DropDownList>
              )}

              {isAuthor && isMobileDevice && (
                <OptionListMobile options={authorOptions.current}>
                  <Button size="tiny" clickEffect hover rounded>
                    <TfiMoreAlt className="text-gray-font-4" />
                  </Button>
                </OptionListMobile>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isMobileDevice && showReplyInput && (
        <div className="mt-3 ml-12">
          <Reply setShowReplyInput={setShowReplyInput} replyTo={comment} />
        </div>
      )}

      {showInputModal && isMobileDevice && (
        <InputModal setShowInputModal={setShowInputModal} isComment={false} />
      )}

      {/* todo: replies */}
    </div>
  )
}
