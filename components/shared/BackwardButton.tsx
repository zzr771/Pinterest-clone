"use client"
import Button from "@/components/shared/Button"
import { FaArrowLeft } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function BackwardButton() {
  const [screenWidth, setScreenWidth] = useState(1920)

  useEffect(() => {
    setScreenWidth(window.innerWidth)
  }, [])

  const router = useRouter()
  return (
    <Button
      hover
      clickEffect
      rounded
      bgColor={screenWidth > 540 ? "white" : "translucent"}
      click={() => router.back()}>
      <FaArrowLeft className="text-xl text-black" />
    </Button>
  )
}
