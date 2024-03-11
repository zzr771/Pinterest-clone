"use client"

import { useState } from "react"
import { FaSearch, FaUser } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"

export default function NavBarBottom() {
  if (window.innerWidth >= 820) return null
  const [activeBtn, setActiveBtn] = useState("Home")

  return (
    <section className="sm:nav-float-bottom max-w3:nav-bottom bg-white">
      <div className="w-full h-full flex justify-around items-center max-w3:p-0">
        <div className={`${activeBtn === "Home" ? "text-black" : "text-gray-font-3"}`}>
          <AiFillHome className="w-6 h-6" />
        </div>

        <div className={`${activeBtn === "Search" ? "text-black" : "text-gray-font-3"}`}>
          <FaSearch className="w-6 h-6" />
        </div>

        <div className={`${activeBtn === "Saved" ? "text-black" : "text-gray-font-3"}`}>
          <FaUser className="w-6 h-6" />
        </div>
      </div>
    </section>
  )
}
