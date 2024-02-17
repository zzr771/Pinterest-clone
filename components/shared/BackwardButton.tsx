"use client"
import Button from "@/components/shared/Button"
import { FaArrowLeft } from "react-icons/fa6"
import { useRouter } from "next/navigation"

export default function BackwardButton() {
  const router = useRouter()
  return (
    <Button hover clickEffect rounded bgColor={"white"} click={() => router.back()}>
      <FaArrowLeft className="text-xl text-black" />
    </Button>
  )
}
