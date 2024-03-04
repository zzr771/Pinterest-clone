"use client"

import { useAppSelector } from "@/lib/store/hook"

export default function Modal() {
  const screenSize = useAppSelector((state: any) => state.screenSize.screenSize)
  const showSearchSuggestion = useAppSelector((state: any) => state.searchSuggestion.showSearchSuggestion)

  if (!(screenSize >= 820) || !showSearchSuggestion) return null

  return <div className="fixed top-[80px] left-0 right-0 bottom-0 z-[99] bg-gray-tp-1"></div>
}
