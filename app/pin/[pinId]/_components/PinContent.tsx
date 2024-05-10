"use client"
import dynamic from "next/dynamic"
import { Suspense, useEffect, useLayoutEffect, useMemo, useState } from "react"
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
const DropDownList = dynamic(() => import("@/components/shared/DropDownList"), { ssr: false })
const IntersectionMonitor = dynamic(() => import("@/components/mobile/IntersectionMonitor"), { ssr: false })
const ButtonsMobile = dynamic(() => import("./ButtonsMobile"))
const CommentsMobile = dynamic(() => import("./CommentsMobile"))
import { PinInfoDeep } from "@/lib/types"
import { abbreviateNumber, handleDownloadImage, shortenURL } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/store/hook"
import useSavePin from "@/lib/hooks/useSavePin"
import useFollowUser from "@/lib/hooks/useFollowUser"
import { setShowEditPinForm } from "@/lib/store/features/modal"
import { setPinBasicInfo, setPinComments, setPinReactions } from "@/lib/store/features/pinInfo"

export default function PinContent({ pin }: { pin: PinInfoDeep }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((store) => store.user.user)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [isCommentsFolded, setIsCommentsFolded] = useState(false)
  const [showDropDownList, setShowDropDownList] = useState(false)
  const [showCommentsMobile, setshowCommentsMobile] = useState(false)

  const pinBasicInfo = useAppSelector((store) => store.pinInfo.pinBasicInfo)
  const pinComments = useAppSelector((store) => store.pinInfo.pinComments)
  const pinReactions = useAppSelector((store) => store.pinInfo.pinReactions)
  const { _id, imageUrl } = pin
  /*
      To reflect changes (edit, comment, reply ) and update the page partially,
    store the Pin and update it in part. When rendering, 'pinInfoInStore' takes 
    priority over prior 'pin', because pin is the original data from the server.
  */
  const title = pinBasicInfo.title || pin.title
  const link = pinBasicInfo.link || pin.link
  const description = pinBasicInfo.description || pin.description
  const author = pinBasicInfo.author || pin.author

  const comments = pinComments || pin.comments
  const reactions = pinReactions || pin.reactions

  useLayoutEffect(() => {
    pin.comments.forEach((comment) => {
      if (comment?.replies.length && comment.replies.length > 3) {
        comment.collapseReplies = true
      }
    })
    dispatch(
      setPinBasicInfo({
        _id,
        imageUrl,
        title,
        link,
        description,
        author,
      })
    )
    dispatch(setPinComments(pin.comments))
    dispatch(setPinReactions(pin.reactions))
  }, [])

  const options = useMemo(() => {
    const arr = [
      {
        label: "Download image",
        callback: () => {
          handleDownloadImage(imageUrl, title || "Pinterest")
          setShowDropDownList(false)
        },
      },
    ]
    if (user?._id === author._id) {
      arr.push(
        ...[
          {
            label: "Edit Pin",
            callback: () => {
              dispatch(setShowEditPinForm(true))
              setShowDropDownList(false)
            },
          },
          { label: "Delete Pin", callback: () => {} },
        ]
      )
    }
    return arr
  }, [user])

  function foldComments() {
    setIsCommentsFolded(true)
  }
  function unfoldComments() {
    setIsCommentsFolded(false)
  }

  useLayoutEffect(() => {
    if (window.innerWidth < 820) {
      setIsMobileDevice(true)
    }
  }, [])

  const { isSaved, savePin, unsavePin } = useSavePin(user?.saved.includes(_id) || false)
  const { isFollowing, followUser, unfollowUser } = useFollowUser(
    user?.following.includes(author._id) || false
  )
  const [displayedFollowerNum, setDisplayedFollowerNum] = useState(author?.follower?.length || 0)
  async function handleFollowUser() {
    const res = await followUser(author._id)
    if (res === true) {
      setDisplayedFollowerNum((prev) => prev + 1)
    }
  }
  async function handleUnfollowUser() {
    const res = await unfollowUser(author._id)
    if (res === true) {
      setDisplayedFollowerNum((prev) => prev - 1)
    }
  }

  return (
    <div className="flex flex-col pin-image-width min-h-[205px] w5:min-h-[592px] w5:max-h-[902px] w3:max-w5:rounded-b-[2rem] w5:rounded-r-[2rem]">
      <div className="relative flex flex-col flex-1 w3:pl-8 pl-4">
        {/* top bar */}
        {!isMobileDevice && (
          <div className="flex justify-between items-center h-[3.75rem] pt-8 pr-8 box-content bg-white w3:max-w5:rounded-0 w5:rounded-tr-[2rem] sticky top-[64px] z-[5]">
            <Suspense fallback={<div>Suspense</div>}>
              <DropDownList
                options={options}
                position={{ offsetY: 55 }}
                setShowDropDownFromParent={setShowDropDownList}>
                <div className="ml-[-12px]" onClick={() => setShowDropDownList((prev) => !prev)}>
                  <ToolTip text="More options">
                    <Button rounded hover clickEffect bgColor={showDropDownList ? "black" : "transparent"}>
                      <TfiMoreAlt className="w-5 h-5" />
                    </Button>
                  </ToolTip>
                </div>
              </DropDownList>
            </Suspense>
            <div className="flex items-center">
              {user?.saved && (
                <Button
                  text={isSaved ? "Saved" : "Save"}
                  bgColor={isSaved ? "black" : "red"}
                  hover
                  clickEffect
                  click={() => {
                    isSaved ? unsavePin(_id) : savePin(_id)
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* 323px: navBarTop(80) + top bar(92) + comment input(151) */}
        {/* 659px: max-height(902) - top bar(92) - comment input(151) */}
        <div className="flex flex-col flex-1 max-h-[calc(100vh-323px)] w5:max-h-[659px] overflow-y-auto w3:pr-8 pr-4">
          {/* link */}
          {!isMobileDevice && (
            <a target="_black" className="underline cursor-pointer">
              {shortenURL(link || "")}
            </a>
          )}

          {/* title & description */}
          <div className="mt-3 max-w3:order-2">
            <h2 className="font-medium text-[28px]">{title}</h2>
            <div className="py-3">
              <Paragraph maxLines={3} text={description} className="leading-[1.4]" />
            </div>
          </div>

          {/* author */}
          <div className="flex max-w3:order-1 justify-between mt-[1.1rem]">
            <div className="flex">
              {author.imageUrl && (
                <Image
                  src={author.imageUrl}
                  width={48}
                  height={48}
                  alt="avatar"
                  className="rounded-full mr-1 object-cover h-12"
                />
              )}
              <div className="flex flex-col justify-center px-1 text-sm">
                <span className="font-medium">{`${author.firstName} ${author.lastName}`}</span>
                <span>
                  {abbreviateNumber(displayedFollowerNum)} follower
                  {displayedFollowerNum > 1 ? "s" : ""}
                </span>
              </div>
            </div>
            {user?._id !== author._id && user?.following && (
              <Button
                text={isFollowing ? "Following" : "Follow"}
                bgColor={isFollowing ? "black" : "gray"}
                hover
                clickEffect
                click={() => {
                  isFollowing ? handleUnfollowUser() : handleFollowUser()
                }}
              />
            )}
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
                {comments.length > 0 &&
                  comments.map((comment) => {
                    return comment && <CommentCard key={comment?._id} comment={comment} />
                  })}
                <div className="py-4"></div>
              </div>
            </div>
          )}
        </div>

        {isMobileDevice && <ButtonsMobile setshowCommentsMobile={setshowCommentsMobile} />}

        {/* monitor the screen scrolling position and trigger the positioning of ButtonsMobile */}
        {isMobileDevice && (
          <div className="absolute z-[-1] bottom-0">
            {/* h-20: the height of ButtonsMobile */}
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
            <span className="font-medium text-xl">
              {comments.length} Comment{comments.length > 1 ? "s" : ""}
            </span>
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
          <Comment pinId={_id} />
        </div>
      )}

      {isMobileDevice && showCommentsMobile && (
        <CommentsMobile setshowCommentsMobile={setshowCommentsMobile} />
      )}
    </div>
  )
}
