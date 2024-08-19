// This component is used on both mobile and desktop
"use client"
import Image from "next/image"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
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
import { calculateTimefromNow, handleApolloRequestError } from "@/lib/utils"
import Link from "next/link"
import { useMutation } from "@apollo/client"
import { DELETE_COMMENT } from "@/lib/apolloRequests/comment.request"

interface Props {
  comment: CommentInfo
  rootCommentId: string
  handleLike: (commentId: string) => Promise<boolean>
  handleUnlike: (commentId: string) => Promise<boolean>
  setComments: React.Dispatch<React.SetStateAction<CommentInfo[]>>
}
export default function CommentCard({
  comment,
  rootCommentId,
  handleLike,
  handleUnlike,
  setComments,
}: Props) {
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false) // desktop
  const [showInputModal, setShowInputModal] = useState(false) // mobile
  const { author, content, likes, replies = [], replyToUser, createdAt } = comment
  const user = useAppSelector((store) => store.user.user)
  const isAuthor = author._id === user?._id
  const [commentOnEdit, setCommentOnEdit] = useState<undefined | CommentInfo>(undefined)

  // --------------------------------------------------------------------- Author Options
  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })
  const authorOptions = useRef([
    {
      label: "Edit",
      callback: () => {
        setCommentOnEdit(comment)
        setShowReplyInput(true)
        setShowInputModal(true)
      },
    },
    {
      label: "Delete",
      callback: async () => {
        const {
          data: { deleteComment: res },
        } = await deleteComment({
          variables: {
            commentId: comment._id,
            commentOnPin: comment.commentOnPin,
            replyToComment: comment.replyToComment,
          },
        })

        if (!res) {
          toast.error("Something went wrong")
          return
        }

        if (comment.isReply) {
          setComments((prev) => {
            return prev.map((parent) => {
              return {
                ...parent,
                replies: parent.replies.filter((reply) => reply._id !== comment._id),
              }
            })
          })
        } else {
          setComments((prev) => {
            return prev.filter((item) => item._id !== comment._id)
          })
        }
      },
    },
  ])

  useLayoutEffect(() => {
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
    setCommentOnEdit(undefined)
    setShowReplyInput((prev) => !prev)
    setShowInputModal(true)
  }

  // --------------------------------------------------------------------- Displayed Replies
  const [displayedReplies, setDisplayedReplies] = useState<CommentInfo[]>(replies.slice(0, 1))
  const [showAllReplies, setShowAllReplies] = useState(false)

  useEffect(() => {
    if (showAllReplies) {
      setDisplayedReplies(replies)
    } else {
      setDisplayedReplies(replies.slice(0, 1))
    }
  }, [replies.length])

  function toggleShowReplies() {
    if (!showAllReplies) {
      setDisplayedReplies(replies)
      setShowAllReplies(true)
    } else {
      setDisplayedReplies(replies.slice(0, 1))
      setShowAllReplies(false)
    }
  }

  // --------------------------------------------------------------------- Like & Unlike
  const [likeCount, setLikeCount] = useState(likes)
  const userLikedComment = useAppSelector((store) => store.user.likedComments)
  const isLiked = userLikedComment && userLikedComment.includes(comment._id)

  async function like() {
    try {
      const res = await handleLike(comment._id)
      if (res) {
        setLikeCount(likeCount + 1)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function unlike() {
    try {
      const res = await handleUnlike(comment._id)
      if (res) {
        setLikeCount(likeCount - 1)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="my-2.5">
      {/* 
        Content of the comment
        When editing, the content part will be hidden temporarily
      */}
      <div className={`flex ${!isMobileDevice && commentOnEdit && "hidden"}`}>
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
              {isLiked ? (
                <HiHeart className="w-5 h-5 cursor-pointer text-red" onClick={unlike} />
              ) : (
                <HiOutlineHeart className="w-5 h-5 cursor-pointer" onClick={like} />
              )}
              {likeCount}
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
        <div className={`mt-3 ${!commentOnEdit && "ml-12"}`}>
          <Reply
            setShowReplyInput={setShowReplyInput}
            replyTo={comment}
            rootCommentId={rootCommentId}
            setComments={setComments}
            commentOnEdit={commentOnEdit}
            setCommentOnEdit={setCommentOnEdit}
          />
        </div>
      )}

      {replies.length > 1 && (
        <div className="ml-12 my-4 text-gray-font-4 text-xs cursor-pointer" onClick={toggleShowReplies}>
          <span className="mr-2">⎯⎯</span>
          {showAllReplies ? "Hide replies" : `View ${replies.length} replies`}
        </div>
      )}

      {/* reply list */}
      <div className="mt-4 ml-12">
        {displayedReplies &&
          displayedReplies.map((reply) => {
            return (
              reply && (
                <CommentCard
                  key={reply._id}
                  comment={reply}
                  rootCommentId={rootCommentId}
                  handleLike={handleLike}
                  handleUnlike={handleUnlike}
                  setComments={setComments}
                />
              )
            )
          })}
      </div>

      {showInputModal && isMobileDevice && (
        <InputModal
          replyTo={comment}
          rootCommentId={rootCommentId}
          setShowInputModal={setShowInputModal}
          setComments={setComments}
          commentOnEdit={commentOnEdit}
          setCommentOnEdit={setCommentOnEdit}
        />
      )}
    </div>
  )
}
