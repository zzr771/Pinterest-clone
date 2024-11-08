"use client"

import { usePathname } from "next/navigation"
import { FaSearch, FaUser } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"
import Link from "next/link"
import { SignInButton } from "@clerk/nextjs"
import { useRef } from "react"
import Image from "next/image"
import { useAppSelector } from "@/lib/store/hook"

export default function NavBarBottom() {
  const pathname = usePathname()

  const user = useAppSelector((store) => store.user.user)
  const hiddenClerkButtonsRef = useRef<HTMLDivElement>(null)
  function handleSignIn() {
    const signInButton = hiddenClerkButtonsRef?.current?.children[0] as HTMLButtonElement
    if (!signInButton) return
    signInButton.click()
  }

  if (window.innerWidth >= 820) return null

  return (
    <div className="max-sm:nav-bottom sm:nav-float-bottom bg-white" data-test="nav-bar">
      <div className="h-full flex justify-around items-center sm:max-w3:gap-24">
        <Link href="/" data-test="nav-home">
          <div className={`${pathname === "Home" ? "text-black" : "text-gray-font-3"}`}>
            <AiFillHome className="w-6 h-6" />
          </div>
        </Link>

        <Link href="/search-mobile" data-test="nav-search">
          <div className={`${pathname === "Search" ? "text-black" : "text-gray-font-3"}`}>
            <FaSearch className="w-6 h-6" />
          </div>
        </Link>

        {/* avatar */}
        {user && (
          <Link href={`/user/${user?._id}`} className="w-[30px]" data-test="nav-profile">
            {user.imageUrl ? (
              <Image
                src={user?.imageUrl}
                alt="avatar"
                width={30}
                height={30}
                className="w-[30px] h-[30px] rounded-full object-cover"
                sizes="60px"
              />
            ) : (
              <FaUser className="w-6 h-6" />
            )}
          </Link>
        )}
        {!user && (
          <div onClick={handleSignIn} data-test="nav-sign-in">
            <FaUser className="w-6 h-6 text-gray-font-3" />
          </div>
        )}

        <div ref={hiddenClerkButtonsRef} className="hidden" data-test="nav-clerk-buttons">
          <SignInButton mode="modal" />
        </div>
      </div>
    </div>
  )
}
