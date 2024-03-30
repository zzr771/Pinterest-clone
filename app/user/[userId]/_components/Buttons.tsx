"use client"

import { useRef, useState } from "react"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "@/components/shared/Button"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
const DropDownList = dynamic(() => import("@/components/shared/DropDownList"), { ssr: false })

export default function Buttons() {
  const router = useRouter()

  const isMySelf = useRef(false) // Whether the current user is viewing the profile of himself/herself
  const [isFollowing, setIsFollowing] = useState(false) // Whether the current user is following the user that he/she is viewing

  const options = useRef([{ label: "Block", callback: () => {} }])
  const [showDropDownList, setShowDropDownList] = useState(false)

  return (
    <div>
      <div className="flex mt-2 gap-7 items-center">
        {!isMySelf.current && (
          <>
            {isFollowing ? (
              <Button key={"black"} text="Following" bgColor="black" clickEffect />
            ) : (
              <Button key={"red"} text="Follow" bgColor="red" clickEffect hover />
            )}
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
          </>
        )}
        {isMySelf.current && (
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
