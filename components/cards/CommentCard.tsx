"use client"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { HiOutlineHeart, HiHeart } from "react-icons/hi"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "../shared/Button"
import dynamic from "next/dynamic"
const OptionListMobile = dynamic(() => import("../mobile/OptionListMobile"), { ssr: false })
const DropDownList = dynamic(() => import("@/components/shared/DropDownList"), { ssr: false })
import Reply from "../form/Reply"
import InputModal from "../mobile/InputModal"
import { CommentInfo } from "@/lib/types"
import { useAppSelector } from "@/lib/store/hook"
import toast from "react-hot-toast"
import { calculateTimefromNow } from "@/lib/utils"
import Link from "next/link"

interface Props {
  comment: CommentInfo
  rootCommentId: string
}
export default function CommentCard({ comment, rootCommentId }: Props) {
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

  function handleClickReply() {
    if (!user) {
      toast("Please sign in before operation")
      return
    }
    setShowReplyInput((prev) => !prev)
    setShowInputModal(true)
  }

  const [hasLiked, setHasLiked] = useState(user?.likedComments.includes(comment._id))
  function handleLike() {}
  function handleUnlike() {}

  return (
    <div className="my-2.5">
      <div className="flex">
        {/* avatar image */}
        <div className="min-w-8 mr-2">
          {author.imageUrl && (
            <Image
              src={author.imageUrl}
              width={32}
              height={32}
              alt="user avatar"
              className="rounded-full object-cover h-8"
            />
          )}
        </div>

        <div>
          {/* main content */}
          <p>
            {/* user name */}
            <Link href={`/user/${author._id}`} className="font-medium mr-1 hover:underline cursor-pointer">
              {author.firstName}
            </Link>
            {replyToUser && (
              <Link
                href={`/user/${replyToUser._id}`}
                className="font-medium mr-1 hover:underline cursor-pointer text-[#0074EA]">
                {replyToUser.firstName}
              </Link>
            )}
            <span className="ml-1">{content}</span>
          </p>

          {/* buttons */}
          <div className="flex text-gray-font-4 gap-5 text-sm">
            <div>{calculateTimefromNow(createdAt)}</div>
            <div className="font-medium cursor-pointer" onClick={() => handleClickReply()}>
              Reply
            </div>
            <div className="flex items-center font-medium gap-1">
              {hasLiked ? (
                <HiHeart className="w-5 h-5 cursor-pointer text-red" />
              ) : (
                <HiOutlineHeart className="w-5 h-5 cursor-pointer" />
              )}
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

      {/* replies */}
      <div className="mt-4 ml-12">
        {replies &&
          replies.map((reply) => {
            return reply && <CommentCard key={reply._id} comment={reply} rootCommentId={rootCommentId} />
          })}
      </div>

      {!isMobileDevice && showReplyInput && (
        <div className="mt-3 ml-12">
          <Reply setShowReplyInput={setShowReplyInput} replyTo={comment} rootCommentId={rootCommentId} />
        </div>
      )}

      {showInputModal && isMobileDevice && (
        <InputModal setShowInputModal={setShowInputModal} isComment={false} />
      )}

      {/* todo: replies */}
    </div>
  )
}
