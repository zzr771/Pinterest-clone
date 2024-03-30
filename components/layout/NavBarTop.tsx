"use client"

import Image from "next/image"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { FaChevronDown, FaBell, FaUser } from "react-icons/fa"
import { AiFillMessage } from "react-icons/ai"
import { SignInButton, SignOutButton } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"
import Button from "../shared/Button"
import SearchBar from "./SearchBar"
import ToolTip from "../shared/ToolTip"
const DropDownList = dynamic(() => import("@/components/shared/DropDownList"), { ssr: false })

export default function NavBarTop() {
  if (window.innerWidth < 820) return null

  const router = useRouter()
  const pathname = usePathname()
  const [activeBtn, setActiveBtn] = useState("")

  const [showRouteList, setShowRouteList] = useState(false)
  const routeOptions = useRef([
    {
      label: "Home",
      callback: () => {
        router.push("/")
        setShowRouteList(false)
      },
    },
    {
      label: "Create",
      callback: () => {
        router.push("/idea-pin-builder")
        setShowRouteList(false)
      },
    },
  ])

  const userOptions = useRef([
    {
      label: "Settings",
      callback: () => {
        router.push("/settings")
      },
    },
    {
      label: "Sign out",
      callback: () => {
        handleSignOut()
      },
    },
  ])

  useEffect(() => {
    if (pathname === "/") {
      setActiveBtn("Home")
    } else if (pathname === "/idea-pin-builder") {
      setActiveBtn("Create")
    } else {
      setActiveBtn("")
    }
  }, [pathname])

  const { isSignedIn, user } = useUser()

  const hiddenClerkButtonsRef = useRef<HTMLDivElement>(null)
  function handleSignIn() {
    const signInButton = hiddenClerkButtonsRef?.current?.children[0] as HTMLButtonElement
    if (!signInButton) return
    signInButton.click()
  }
  function handleSignOut() {
    const signOutButton = hiddenClerkButtonsRef?.current?.children[1] as HTMLButtonElement
    if (!signOutButton) return
    signOutButton.click()
  }

  return (
    <section className="nav-top items-center bg-white h-20 py-1 px-4 flex">
      {/* Pinterest icon */}
      <Link href="/">
        <Button hover={true} rounded={true}>
          <img src="/assets/icon.png" alt="icon" className="h-6 w-6" />
        </Button>
      </Link>

      {/* Button Group: Home Create */}
      <div className="flex items-center max-w4:hidden">
        <Link href="/">
          <Button text="Home" bgColor={activeBtn === "Home" ? "black" : "transparent"} />
        </Link>
        <Link href="/idea-pin-builder">
          <Button text="Create" bgColor={activeBtn === "Create" ? "black" : "transparent"} />
        </Link>
      </div>

      <DropDownList
        options={routeOptions.current}
        position={{ offsetX: 50, offsetY: 55 }}
        setShowDropDownFromParent={setShowRouteList}
        showCheckMark
        activeOption={activeBtn}>
        <div
          onClick={() => setShowRouteList((prev) => !prev)}
          className={`relative flex items-center p-3.5 ml-2 rounded-full w4:hidden  
          ${showRouteList ? "bg-black text-white hover:bg-black" : "bg-white text-black hover:bg-gray-bg-4"}
         font-medium cursor-pointer leading-5
          `}>
          <div className="flex items-center gap-2">
            <span>{activeBtn || "Home"}</span>
            <FaChevronDown
              className={`h-3.5 w-3.5 w3:max-w4:block hidden ${showRouteList ? "text-white" : "text-black"}`}
            />
          </div>
        </div>
      </DropDownList>

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
        {/* user avatar */}
        {isSignedIn && (
          <ToolTip text="Your profile" position="bottom">
            <Link href={`/user/${user?.id}`}>
              <Button hover rounded>
                {user.imageUrl ? (
                  <Image
                    src={user?.imageUrl}
                    alt="avatar"
                    width={30}
                    height={30}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-font-3 w-6 h-6" />
                )}
              </Button>
            </Link>
          </ToolTip>
        )}
        {/* button for signing in */}
        {!isSignedIn && (
          <ToolTip text="Sign in & sign up" position="left">
            <Button hover rounded click={handleSignIn}>
              <FaUser className="text-gray-font-3 w-6 h-6" />
            </Button>
          </ToolTip>
        )}

        {/* dropdown button for signed in users */}
        {isSignedIn && (
          <DropDownList options={userOptions.current} position={{ offsetX: -80, offsetY: 40 }}>
            <Button hover rounded clickEffect size="small" className="!h-6 !w-6">
              <FaChevronDown />
            </Button>
          </DropDownList>
        )}

        {/* Clerk components. Not displayed. Their click events will be manually invoked when a user signs in or signs out  */}
        <div ref={hiddenClerkButtonsRef} className="hidden">
          <SignInButton mode="modal" />
          <SignOutButton />
        </div>
      </div>
    </section>
  )
}
