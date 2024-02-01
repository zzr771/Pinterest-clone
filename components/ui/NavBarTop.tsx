import { useState } from "react"
import { FaChevronDown, FaBell, FaUser } from "react-icons/fa"
import { AiFillMessage } from "react-icons/ai"
import Button from "../shared/Button"
import SearchBar from "./SearchBar"
import { useSelector } from "react-redux"

export default function NavBarTop() {
  const screenSize = useSelector((state: any) => state.screenSize.screenSize)

  const [activeBtn, setActiveBtn] = useState("Home")

  if (screenSize < 820) return null

  return (
    <div className="flex items-center bg-white h-20 py-1 px-4">
      {/* Pinterest icon */}
      <Button
        hover={true}
        rounded={true}
        click={() => {
          /* todo */
        }}>
        <img src="/assets/icon.png" alt="icon" className="h-6 w-6" />
      </Button>

      {/* Button Group: Home Explore Create */}
      <div className="flex items-center">
        <Button text="Home" click={() => {}} bgColor={activeBtn === "Home" ? "black" : "transparent"} />
        <div className="flex items-center max-w4:hidden">
          <Button
            text="Explore"
            click={() => {}}
            bgColor={activeBtn === "Explore" ? "black" : "transparent"}
          />
          <Button text="Create" click={() => {}} bgColor={activeBtn === "Create" ? "black" : "transparent"} />
        </div>
        <FaChevronDown className="h-3 w-3 ml-2 w3:max-w4:block hidden text-black" />
      </div>

      <SearchBar />

      {/* Button Group: Notification Message Profile */}
      <div className="flex items-center">
        <Button
          hover={true}
          rounded={true}
          click={() => {
            /* todo */
          }}>
          <FaBell className="text-gray-font-3 w-6 h-6" />
        </Button>
        <Button
          hover={true}
          rounded={true}
          click={() => {
            /* todo */
          }}>
          <AiFillMessage className="text-gray-font-3 w-6 h-6" />
        </Button>
        <Button
          hover={true}
          rounded={true}
          click={() => {
            /* todo */
          }}>
          {/* todo: replace it with Clerk */}
          <FaUser className="text-gray-font-3 w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
