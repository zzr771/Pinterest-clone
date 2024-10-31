"use client"

import { useAppSelector } from "@/lib/store/hook"

export default function Modal() {
  const showModal = useAppSelector((store) => store.modal.showModal)

  if (!showModal) return null

  return <div className="fixed top-0 left-0 right-0 bottom-0 z-[99] bg-gray-tp-1" data-test="modal"></div>
}
