"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { FaChevronDown, FaBell, FaUser } from "react-icons/fa"
import { AiFillMessage } from "react-icons/ai"
import Button from "../shared/Button"
import SearchBar from "./SearchBar"
import ToolTip from "../shared/ToolTip"
import DropDownList from "../shared/DropDownList"
import useDropDownList from "@/lib/useDropDownList"

export default function NavBarTop() {
  const router = useRouter()
  const [activeBtn, setActiveBtn] = useState("Home")

  const options = useRef([{ label: "Home" }, { label: "Create" }])
  const dropContainerRef = useRef<HTMLDivElement>(null)
  const [showDropDownList, setShowDropDownList] = useState(false)
  useDropDownList({ dropContainerRef, showDropDownList, setShowDropDownList })

  function onSelectionChange(activeOption: string) {
    setActiveBtn(activeOption)
  }

  return (
    <section className="nav-top items-center bg-white h-20 py-1 px-4 w3:flex hidden">
      {/* Pinterest icon */}
      <Button
        hover={true}
        rounded={true}
        click={() => {
          setActiveBtn("Home")
          router.push("/")
        }}>
        <img src="/assets/icon.png" alt="icon" className="h-6 w-6" />
      </Button>

      {/* Button Group: Home Explore Create */}
      <div className="flex items-center max-w4:hidden">
        <Button
          text="Home"
          click={() => {
            setActiveBtn("Home")
            router.push("/")
          }}
          bgColor={activeBtn === "Home" ? "black" : "transparent"}
        />
        {/* <Button
          text="Explore"
          bgColor={activeBtn === "Explore" ? "black" : "transparent"}
          className="cursor-not-allowed"
        /> */}
        <Button
          text="Create"
          click={() => {
            setActiveBtn("Create")
            router.push("/idea-pin-builder")
          }}
          bgColor={activeBtn === "Create" ? "black" : "transparent"}
        />
      </div>

      <div
        ref={dropContainerRef}
        className={`relative flex items-center p-3.5 ml-2 rounded-full w4:hidden  
        ${showDropDownList ? "bg-black text-white hover:bg-black" : "bg-white text-black hover:bg-gray-bg-4"}
       font-medium cursor-pointer leading-5
        `}
        onClick={() => setShowDropDownList((prev) => !prev)}>
        <div className="flex items-center gap-2">
          <span>{activeBtn}</span>
          <FaChevronDown
            className={`h-3.5 w-3.5 w3:max-w4:block hidden ${showDropDownList ? "text-white" : "text-black"}`}
          />
        </div>
        {showDropDownList && (
          <div className="horizontal-middle top-[60px] z-5">
            <DropDownList options={options.current} onSelectionChange={onSelectionChange} showCheckMark />
          </div>
        )}
      </div>

      <SearchBar />

      {/* Button Group: Notification Message Profile */}
      <div className="flex items-center">
        <ToolTip text="Notifications" position="bottom">
          <Button hover rounded className="!cursor-not-allowed">
            <FaBell className="text-gray-font-3 w-6 h-6" />
          </Button>
        </ToolTip>
        <ToolTip text="Messages" position="bottom">
          <Button hover rounded className="!cursor-not-allowed">
            <AiFillMessage className="text-gray-font-3 w-6 h-6" />
          </Button>
        </ToolTip>
        <ToolTip text="Your profile" position="bottom">
          <Button hover rounded>
            {/* todo: replace it with Clerk */}
            <FaUser className="text-gray-font-3 w-6 h-6" />
          </Button>
        </ToolTip>
      </div>
    </section>
  )
}
