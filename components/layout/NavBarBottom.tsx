"use client"

import { useRouter, usePathname } from "next/navigation"
import { FaSearch, FaUser } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"

export default function NavBarBottom() {
  if (window.innerWidth >= 820) return null

  const router = useRouter()
  const pathname = usePathname()

  return (
    <section className="sm:nav-float-bottom max-w3:nav-bottom bg-white">
      <div className="w-full h-full flex justify-around items-center max-w3:p-0">
        <div
          onClick={() => router.push("/")}
          className={`${pathname === "Home" ? "text-black" : "text-gray-font-3"}`}>
          <AiFillHome className="w-6 h-6" />
        </div>

        <div
          onClick={() => router.push("/search")}
          className={`${pathname === "Search" ? "text-black" : "text-gray-font-3"}`}>
          <FaSearch className="w-6 h-6" />
        </div>

        <div
          onClick={() => router.push("/userID")}
          className={`${pathname === "Saved" ? "text-black" : "text-gray-font-3"}`}>
          <FaUser className="w-6 h-6" />
        </div>
      </div>
    </section>
  )
}
