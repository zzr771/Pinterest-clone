"use client"
import dynamic from "next/dynamic"
import { Suspense, useLayoutEffect, useMemo, useState } from "react"
import Image from "next/image"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "@/components/shared/Button"
import Paragraph from "@/components/shared/Paragraph"
import Reaction from "@/components/shared/Reaction"
import Comment from "@/components/form/Comment"
import ToolTip from "@/components/shared/ToolTip"
const DropDownList = dynamic(() => import("@/components/shared/DropDownList"), { ssr: false })
const IntersectionMonitor = dynamic(() => import("@/components/mobile/IntersectionMonitor"), { ssr: false })
const ButtonsMobile = dynamic(() => import("./ButtonsMobile"))
const CommentList = dynamic(() => import("./CommentList"))
const CommentListMobile = dynamic(() => import("./CommentListMobile"))
import { CommentInfo, PinInfoBasic, PinInfoDeep } from "@/lib/types"
import { abbreviateNumber, handleApolloRequestError, handleDownloadImage, shortenURL } from "@/lib/utils"
import { useAppSelector } from "@/lib/store/hook"
import useSavePin from "@/lib/hooks/useSavePin"
import useFollowUser from "@/lib/hooks/useFollowUser"
import useInvalidateRouterCache from "@/lib/hooks/useInvalidateRouterCache"
import EditPinContainer from "./EditPinContainer"
import { DELETE_PIN } from "@/lib/apolloRequests/pin.request"
import { useMutation } from "@apollo/client"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Dialog, { dialog } from "@/components/shared/Dialog"
import { deleteFiles } from "@/lib/actions/uploadthing.actions"
import showMessageBox from "@/components/shared/showMessageBox"

export default function PinContent({ pin }: { pin: PinInfoDeep }) {
  const { _id, imageUrl, author } = pin
  const router = useRouter()
  const user = useAppSelector((store) => store.user.user)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [showDropDownList, setShowDropDownList] = useState(false)
  const [showCommentsMobile, setshowCommentsMobile] = useState(false)

  const [pinBasicInfo, setPinBasicInfo] = useState<PinInfoBasic>({
    _id: pin._id,
    title: pin.title,
    link: pin.link,
    description: pin.description,
  })
  const [comments, setComments] = useState<CommentInfo[]>((pin.comments as CommentInfo[]) || [])

  const [showEditPinForm, setShowEditPinForm] = useState(false)
  const [deletePinMutation] = useMutation(DELETE_PIN, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })
  async function handleDeletePin() {
    if (!user) {
      toast("Please sign in before operation")
      return false
    }

    const {
      data: { deletePin: res },
    } = await deletePinMutation({
      variables: {
        pinId: _id,
        userId: user._id,
      },
    })

    if (!res) {
      toast.error("Something went wrong")
      return
    }

    const res2 = await deleteFiles([imageUrl])
    if (res2 && "errorMessage" in res) {
      toast.error(res.errorMessage)
    }

    showMessageBox({
      message: "Pin deleted",
    })
    /*
        If a user clicks his Pin on Home page, gets into this Pin's content page and deletes this
      Pin, he will be redirected to Home page. However, due to router cache, the deleted Pin will
      still be displayed on Home page. If he clicks this Pin, he will see the Pin's content again
      (router cache).
        What we want is that when the user clicks the deleted Pin's card on Home page, he can get
      into the Pin's content page, but the page should be taken over by 'error.tsx' and tell the user
      that this Pin has been deleted.
        To achieve this, we need to refresh the router cache. 
        Note that 'router.refresh()' must go after 'router.replace()', otherwise the cache of Pin
      content page won't be invalidated.
    */
    router.replace("/")
    router.refresh()
  }

  const options = useMemo(() => {
    const arr = [
      {
        label: "Download image",
        callback: () => {
          handleDownloadImage(imageUrl, pinBasicInfo.title || "Pinterest")
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
              setShowEditPinForm(true)
              setShowDropDownList(false)
            },
          },
          {
            label: "Delete Pin",
            callback: () => {
              dialog({
                title: "Delete your Pin?",
                confirmText: "Delete",
                cancelText: "Cancel",
                confirmCallback: handleDeletePin,
              })
            },
          },
        ]
      )
    }
    return arr
  }, [user])

  useLayoutEffect(() => {
    if (window.innerWidth < 820) {
      setIsMobileDevice(true)
    }
  }, [])

  // --------------------------------------------------------------------------------- Save & Unsave
  const userSaved = useAppSelector((store) => store.user.saved)
  const { savePin, unsavePin } = useSavePin()
  const isSaved = useMemo(() => userSaved && userSaved.includes(_id), [userSaved])

  // --------------------------------------------------------------------------------- Follow & Unfollow
  const { needInvalidate } = useInvalidateRouterCache()
  const following = useAppSelector((store) => store.user.following)
  const isFollowing = useMemo(() => following && following.includes(author._id), [following, user?._id])
  const [displayedFollowerNum, setDisplayedFollowerNum] = useState(author?.follower?.length || 0)

  async function followHandler() {
    setDisplayedFollowerNum((prev) => prev + 1)
    needInvalidate.current = true
  }
  async function unfollowHandler() {
    setDisplayedFollowerNum((prev) => prev - 1)
    needInvalidate.current = true
  }
  const { followUser, unfollowUser } = useFollowUser({ followHandler, unfollowHandler })

  return (
    <>
      <EditPinContainer
        pinInfoBasic={{
          _id,
          title: pinBasicInfo.title,
          description: pinBasicInfo.description,
          link: pinBasicInfo.link,
        }}
        setPinBasicInfo={setPinBasicInfo}
        showEditPinForm={showEditPinForm}
        setShowEditPinForm={setShowEditPinForm}
      />
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
                {userSaved && (
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
              <a target="_blank" href={pinBasicInfo.link} className="underline cursor-pointer">
                {shortenURL(pinBasicInfo.link || "")}
              </a>
            )}

            {/* title & description */}
            <div className="mt-3 max-w3:order-2">
              <h2 className="font-medium text-[28px]">{pinBasicInfo.title}</h2>
              <div className="py-3">
                <Paragraph maxLines={3} text={pinBasicInfo.description} className="leading-[1.4]" />
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
                    className="rounded-full mr-1 object-cover h-12 cursor-pointer"
                    onClick={() => router.push(`/user/${author._id}`)}
                  />
                )}
                <div className="flex flex-col justify-center px-1 text-sm">
                  <span
                    className="font-medium cursor-pointer"
                    onClick={() =>
                      router.push(`/user/${author._id}`)
                    }>{`${author.firstName} ${author.lastName}`}</span>
                  <span>
                    {abbreviateNumber(displayedFollowerNum)} follower
                    {displayedFollowerNum > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              {user?._id !== author._id && following && (
                <Button
                  text={isFollowing ? "Following" : "Follow"}
                  bgColor={isFollowing ? "black" : "gray"}
                  hover
                  clickEffect
                  click={() => {
                    isFollowing ? unfollowUser(author._id) : followUser(author._id)
                  }}
                />
              )}
            </div>

            {/* comments */}
            {!isMobileDevice && <CommentList comments={comments} setComments={setComments} />}
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
            <div className="flex justify-end items-center mt-1 mb-2">
              <Reaction initialReactions={pin.reactions} />
            </div>
            <Comment pinId={_id} setComments={setComments} />
          </div>
        )}

        {isMobileDevice && showCommentsMobile && (
          <CommentListMobile setshowCommentsMobile={setshowCommentsMobile} />
        )}
      </div>
      <Dialog />
    </>
  )
}
