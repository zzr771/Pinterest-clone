"use client"
import Button from "@/components/shared/Button"
import { FaArrowLeft, FaAngleLeft } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import { useLayoutEffect, useState } from "react"

export default function BackwardButton() {
  const [screenWidth, setScreenWidth] = useState(0)

  useLayoutEffect(() => {
    setScreenWidth(window.innerWidth)
  }, [])

  const router = useRouter()
  return (
    <Button
      hover
      clickEffect
      rounded
      bgColor={screenWidth > 820 ? "white" : "translucent"}
      className={screenWidth > 0 ? "visible" : "invisible"}
      click={() => router.back()}>
      {screenWidth > 820 ? (
        <FaArrowLeft className="text-xl text-black" />
      ) : (
        <FaAngleLeft className="text-xl text-black" />
      )}
    </Button>
  )
}
