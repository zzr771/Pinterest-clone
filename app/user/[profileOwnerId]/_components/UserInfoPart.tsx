"use client"

import dynamic from "next/dynamic"
import OptionListMobile from "@/components/mobile/OptionListMobile"
import BackwardButton from "@/components/shared/BackwardButton"
import { useAppSelector } from "@/lib/store/hook"
import { abbreviateNumber } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { RiSettingsFill } from "react-icons/ri"
import { FaPinterest, FaUser } from "react-icons/fa"
import Paragraph from "@/components/shared/Paragraph"
import Buttons from "./Buttons"
import { UserInfo } from "@/lib/types"
import useInvalidateRouterCache from "@/lib/hooks/useInvalidateRouterCache"
import useFollowUser from "@/lib/hooks/useFollowUser"
import { SignOutButton } from "@clerk/nextjs"
const FollowerList = dynamic(() => import("./FollowerList"))
const FollowerListMobile = dynamic(() => import("./FollowerListMobile"))

interface Props {
  profileOwner: UserInfo
}
export default function UserInfoPart({ profileOwner }: Props) {
  const { follower, following } = profileOwner
  const user = useAppSelector((state) => state.user.user)
  const userFollowing = useAppSelector((state) => state.user.following)
  const hiddenClerkButtonsRef = useRef<HTMLDivElement>(null)

  // --------------------------------------------------------------------------------- What buttons to show
  const [isMyself, setIsMyself] = useState(false) // Whether the current user is viewing the profile of himself/herself
  const [isFollowing, setIsFollowing] = useState(false) // Whether the current user is following the profile owner
  useEffect(() => {
    if (!user) {
      setIsMyself(false)
    } else {
      setIsMyself(profileOwner?._id === user._id)
    }
  }, [user])
  useEffect(() => {
    if (!userFollowing) return
    setIsFollowing(userFollowing.includes(profileOwner._id))
  }, [userFollowing])

  // --------------------------------------------------------------------------------- Follow & Unfollow
  const { needInvalidate } = useInvalidateRouterCache()
  const [displayedFollowerNum, setDisplayedFollowerNum] = useState(follower.length || 0)
  async function followHandler() {
    setDisplayedFollowerNum((prev) => prev + 1)
    needInvalidate.current = true
  }
  async function unfollowHandler() {
    setDisplayedFollowerNum((prev) => prev - 1)
    needInvalidate.current = true
  }
  const { followUser, unfollowUser } = useFollowUser({ followHandler, unfollowHandler })

  // --------------------------------------------------------------------------------- Follow list
  const [showFollowList, setShowFollowList] = useState(false)
  const [followType, setFollowType] = useState<"follower" | "following">("follower")

  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const options = useRef([
    {
      label: "Sign out",
      callback: () => {
        const signOutButton = hiddenClerkButtonsRef?.current?.children[0] as HTMLButtonElement
        if (!signOutButton) return
        signOutButton.click()
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

  return (
    <div>
      {isMobileDevice && (
        <div className="fixed left-2 top-2 z-[1]">
          <BackwardButton />
        </div>
      )}
      {isMobileDevice && isMyself && (
        <div className="absolute right-2 top-2 z-[1]">
          <OptionListMobile options={options.current}>
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white">
              <RiSettingsFill className="w-5 h-5 " />
            </div>
          </OptionListMobile>
        </div>
      )}

      <div className="flex flex-col items-center w3:w-[488px] max-w3:w-screen mx-auto mb-8">
        {/* avatar */}
        {profileOwner?.imageUrl ? (
          <Image
            className="rounded-full bg-gray-bg-1 mb-1 object-cover h-[120px]"
            src={profileOwner?.imageUrl}
            alt="user avatar"
            width={120}
            height={120}
          />
        ) : (
          <FaUser className="text-gray-font-3 w-[80px] h-[80px]" />
        )}

        {/* full name */}
        <h2 className="mt-1  font-medium text-[2.2rem]">
          {profileOwner?.firstName} {profileOwner?.lastName}
        </h2>
        {/* username */}
        <div className="flex items-center mb-2 gap-1 text-gray-font-4">
          <FaPinterest />
          <span className="text-sm font-light">{profileOwner?.username}</span>
        </div>
        {/* website & about */}
        <Paragraph maxLines={3} className="text-center max-w3:mx-5">
          <span>
            <span className="font-medium cursor-pointer hover:underline">{profileOwner?.website}</span>
            {profileOwner?.website && " · "}
            <span className="font-light">{profileOwner?.about}</span>
          </span>
        </Paragraph>
        {/* follower & following */}
        <div className="my-2 font-medium">
          <span
            className="cursor-pointer"
            onClick={() => {
              if (displayedFollowerNum > 0) {
                setFollowType("follower")
                setShowFollowList(true)
              }
            }}>
            <span>{`${abbreviateNumber(displayedFollowerNum)} ${
              displayedFollowerNum > 1 ? "followers" : "follower"
            } · `}</span>
          </span>

          <span
            className="cursor-pointer"
            onClick={() => {
              if (following.length > 0) {
                setFollowType("following")
                setShowFollowList(true)
              }
            }}>
            <span>{abbreviateNumber(following?.length || 0)} following</span>
          </span>
        </div>

        <Buttons
          userId={profileOwner._id}
          isMyself={isMyself}
          isFollowing={isFollowing}
          followUser={followUser}
          unfollowUser={unfollowUser}
        />
      </div>

      {showFollowList && !isMobileDevice && (
        <FollowerList
          userId={profileOwner._id}
          type={followType}
          number={followType === "follower" ? displayedFollowerNum : following?.length}
          setShowFollowList={setShowFollowList}
        />
      )}
      {showFollowList && isMobileDevice && (
        <FollowerListMobile
          userId={profileOwner._id}
          type={followType}
          number={followType === "follower" ? displayedFollowerNum : following?.length}
          setShowFollowList={setShowFollowList}
        />
      )}

      <div ref={hiddenClerkButtonsRef} className="hidden">
        <SignOutButton />
      </div>
    </div>
  )
}
