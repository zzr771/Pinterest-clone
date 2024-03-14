"use client"

import { useRef, useState } from "react"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "@/components/shared/Button"
import DropDownList from "@/components/shared/DropDownList"
import useDropDownList from "@/lib/hooks/useDropDownList"
import { useRouter } from "next/navigation"

export default function Buttons() {
  const router = useRouter()

  const [isFollowing, setIsFollowing] = useState(false) // Whether the current user is following the user that he/she is viewing
  const isMySelf = useRef(false) // Whether the current user is viewing the profile of himself/herself

  const options = useRef([{ label: "Block", callback: () => {} }])
  const dropContainerRef = useRef<HTMLDivElement>(null)
  const [showDropDownList, setShowDropDownList] = useState(false)
  useDropDownList({ dropContainerRef, showDropDownList, setShowDropDownList })

  return (
    <div>
      <div className="flex mt-2 gap-7">
        {!isMySelf.current && (
          <>
            {isFollowing ? (
              <Button key={"black"} text="Following" bgColor="black" clickEffect />
            ) : (
              <Button key={"red"} text="Follow" bgColor="red" clickEffect hover />
            )}
            <div ref={dropContainerRef} className="flex items-center relative z-[1]">
              <Button
                rounded
                hover
                clickEffect
                click={() => setShowDropDownList((prev) => !prev)}
                bgColor={showDropDownList ? "black" : "transparent"}>
                <TfiMoreAlt className="w-5 h-5" />
              </Button>
              {showDropDownList && (
                <div className="horizontal-middle top-[58px]">
                  <DropDownList title="Profile options" options={options.current} />
                </div>
              )}
            </div>
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
