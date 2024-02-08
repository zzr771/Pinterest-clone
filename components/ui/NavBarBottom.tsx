"use client"

import { useState } from "react"
import { FaSearch, FaUser } from "react-icons/fa"
import { AiFillMessage, AiFillHome } from "react-icons/ai"
import { useAppSelector } from "@/lib/store/hook"

export default function NavBarBottom() {
  const screenSize = useAppSelector((state: any) => state.screenSize.screenSize)

  const [activeBtn, setActiveBtn] = useState("Home")

  if (screenSize >= 820) return null

  return (
    <section className="sm:nav-float-bottom max-w3:nav-bottom bg-white">
      <div className="w-full h-full flex justify-around max-sm:p-2 max-sm:pt-0">
        <div
          className={`flex flex-col justify-center items-center ${
            activeBtn === "Home" ? "text-black" : "text-gray-font-3"
          }`}>
          <div className="w-10 h-10 p-2">
            <AiFillHome className="w-full h-full" />
          </div>
          <span className="text-xs">Home</span>
        </div>

        <div
          className={`flex flex-col justify-center items-center ${
            activeBtn === "Search" ? "text-black" : "text-gray-font-3"
          }`}>
          <div className="w-10 h-10 p-2.5">
            <FaSearch className="w-full h-full" />
          </div>
          <span className="text-xs">Search</span>
        </div>

        <div
          className={`flex flex-col justify-center items-center ${
            activeBtn === "Notification" ? "text-black" : "text-gray-font-3"
          }`}>
          <div className="w-10 h-10 p-2">
            <AiFillMessage className="w-full h-full" />
          </div>
          <span className="text-xs">Notification</span>
        </div>

        <div
          className={`flex flex-col justify-center items-center ${
            activeBtn === "Saved" ? "text-black" : "text-gray-font-3"
          }`}>
          <div className="w-10 h-10 p-2">
            <FaUser className="w-full h-full" />
          </div>
          <span className="text-xs">Saved</span>
        </div>
      </div>
    </section>
  )
}
