"use client"

import { useEffect, useRef, useState } from "react"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "@/components/shared/Button"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import OptionListMobile from "@/components/mobile/OptionListMobile"
const DropDownList = dynamic(() => import("@/components/shared/DropDownList"), { ssr: false })

interface Props {
  userId: string
  isMyself: boolean
  isFollowing: boolean
  followUser: (targetUserId: string) => Promise<void>
  unfollowUser: (targetUserId: string) => Promise<void>
}
export default function Buttons({ userId, isMyself, isFollowing, followUser, unfollowUser }: Props) {
  const router = useRouter()

  // -------------------------- Currently skip the 'block' function, thus related dropdown list is commented out
  // const options = useRef([{ label: "Block", callback: () => {} }])
  // const [showDropDownList, setShowDropDownList] = useState(false)
  // const [isMobileDevice, setIsMobileDevice] = useState(false)
  // useEffect(() => {
  //   setIsMobileDevice(window.innerWidth < 820)
  // }, [])

  return (
    <div>
      <div className="flex mt-2 gap-7 items-center">
        {!isMyself && (
          <>
            {isFollowing ? (
              <Button
                key={"black"}
                text="Following"
                bgColor="black"
                clickEffect
                click={() => {
                  unfollowUser(userId)
                }}
              />
            ) : (
              <Button
                key={"red"}
                text="Follow"
                bgColor="red"
                clickEffect
                hover
                click={() => {
                  followUser(userId)
                }}
              />
            )}
            {/* {!isMobileDevice && (
              <DropDownList
                options={options.current}
                title="Profile options"
                position={{ offsetY: 55 }}
                setShowDropDownFromParent={setShowDropDownList}>
                <Button
                  rounded
                  hover
                  clickEffect
                  click={() => setShowDropDownList((prev) => !prev)}
                  bgColor={showDropDownList ? "black" : "transparent"}>
                  <TfiMoreAlt className="w-5 h-5" />
                </Button>
              </DropDownList>
            )}
            {isMobileDevice && (
              <OptionListMobile options={options.current}>
                <Button rounded clickEffect bgColor="transparent">
                  <TfiMoreAlt className="w-5 h-5" />
                </Button>
              </OptionListMobile>
            )} */}
          </>
        )}
        {isMyself && (
          <Button
            text="Edit profile"
            bgColor="gray"
            hover
            clickEffect
            click={() => router.push("/settings")}
          />
        )}
      </div>
    </div>
  )
}
