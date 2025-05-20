"use client"

import Image from "next/image"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { FaChevronDown, FaBell, FaUser } from "react-icons/fa"
import { AiFillMessage } from "react-icons/ai"
import { SignInButton, SignOutButton } from "@clerk/nextjs"
import Button from "../shared/Button"
import SearchBar from "./SearchBar"
import ToolTip from "../shared/ToolTip"
import { useAppSelector } from "@/lib/store/hook"
const DropDownList = dynamic(() => import("@/components/shared/DropDownList"), { ssr: false })

export default function NavBarTop() {
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

  const user = useAppSelector((store) => store.user.user)

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

  if (window.innerWidth < 820) return null

  return (
    <div className="nav-top items-center bg-white h-20 py-1 px-4 flex" data-test="nav-bar">
      {/* Pinterest icon */}
      <Link href="/" data-test="nav-logo">
        <Button hover={true} rounded={true}>
          <Image src="/assets/React-icon.png" alt="icon" height={24} width={24} />
        </Button>
      </Link>

      {/* Button Group: Home Create */}
      <div className="flex items-center max-w4:hidden">
        <Link href="/" data-test="nav-home">
          <Button text="Home" bgColor={activeBtn === "Home" ? "black" : "transparent"} />
        </Link>
        {user ? (
          <Link href="/idea-pin-builder" data-test="nav-create">
            <Button text="Create" bgColor={activeBtn === "Create" ? "black" : "transparent"} />
          </Link>
        ) : (
          <Button text="Create" bgColor="transparent" click={handleSignIn} data-test="nav-create" />
        )}
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
          <Button hover rounded className="!cursor-not-allowed" data-test="nav-notifications">
            <FaBell className="text-gray-font-3 w-6 h-6" />
          </Button>
        </ToolTip>
        <ToolTip text="Messages" position="bottom">
          <Button hover rounded className="!cursor-not-allowed" data-test="nav-messages">
            <AiFillMessage className="text-gray-font-3 w-6 h-6" />
          </Button>
        </ToolTip>
        {/* user avatar */}
        {user && (
          <ToolTip text="Your profile" position="bottom">
            <Link href={`/user/${user?._id}`}>
              <Button hover rounded data-test="nav-profile">
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
                  <FaUser className="text-gray-font-3 w-6 h-6" />
                )}
              </Button>
            </Link>
          </ToolTip>
        )}
        {/* button for signing in */}
        {!user && (
          <ToolTip text="Sign in & sign up" position="left">
            <Button hover rounded click={handleSignIn} data-test="nav-sign-in">
              <FaUser className="text-gray-font-3 w-6 h-6" />
            </Button>
          </ToolTip>
        )}

        {/* dropdown button for signed in users */}
        {user && (
          <DropDownList options={userOptions.current} position={{ offsetX: -80, offsetY: 40 }}>
            <Button
              hover
              rounded
              clickEffect
              size="small"
              className="!h-6 !w-6"
              data-test="nav-profile-dropdown-arrow">
              <FaChevronDown />
            </Button>
          </DropDownList>
        )}

        {/* Clerk components. Not displayed. Their click events will be manually invoked when a user signs in or signs out  */}
        <div ref={hiddenClerkButtonsRef} className="hidden" data-test="nav-clerk-buttons">
          <SignInButton mode="modal" />
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}
