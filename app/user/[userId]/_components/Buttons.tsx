"use client"

import { useEffect, useRef, useState } from "react"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "@/components/shared/Button"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import OptionListMobile from "@/components/mobile/OptionListMobile"
const DropDownList = dynamic(() => import("@/components/shared/DropDownList"), { ssr: false })

export default function Buttons({ isMySelf }: { isMySelf: boolean }) {
  const router = useRouter()

  const [isFollowing, setIsFollowing] = useState(false) // Whether the current user is following the user that he/she is viewing

  const options = useRef([{ label: "Block", callback: () => {} }])
  const [showDropDownList, setShowDropDownList] = useState(false)

  const [isMobileDevice, setIsMobileDevice] = useState(false)
  useEffect(() => {
    setIsMobileDevice(window.innerWidth < 820)
  }, [])

  return (
    <div>
      <div className="flex mt-2 gap-7 items-center">
        {!isMySelf && (
          <>
            {isFollowing ? (
              <Button key={"black"} text="Following" bgColor="black" clickEffect />
            ) : (
              <Button key={"red"} text="Follow" bgColor="red" clickEffect hover />
            )}
            {!isMobileDevice && (
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
            )}
          </>
        )}
        {isMySelf && (
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
