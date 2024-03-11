"use client"

import { useAppSelector } from "@/lib/store/hook"

export default function Modal() {
  const showModal = useAppSelector((state: any) => state.modal.showModal)

  if (!showModal) return null

  return <div className="fixed top-[80px] left-0 right-0 bottom-0 z-[99] bg-gray-tp-1"></div>
}
