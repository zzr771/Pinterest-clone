// this route page is only for mobile devices

"use client"
import { useLayoutEffect } from "react"
import { useRouter } from "next/navigation"
import SlideBanner from "./_components/SlideBanner"
import SearchBar from "./_components/SearchBar"
import { ideasArray, popularArray } from "@/constants/index"
import { FiChevronRight } from "react-icons/fi"
import Image from "next/image"

export default function Page() {
  const router = useRouter()
  useLayoutEffect(() => {
    if (window.innerWidth >= 820) {
      router.push("/")
    }
  }, [])
  return (
    <div>
      <SearchBar />

      <SlideBanner />

      {/* search suggestions */}
      <div className="pb-16">
        <div className="mt-2 mb-5 mx-4">
          <div className="m-0.5 text-xs">Ideas for you</div>
          <div className="flex items-center justify-between">
            <h5 className="m-0.5 font-medium">Beautiful mountains</h5>
            <FiChevronRight className="w-5 h-5" />
          </div>
          <div className="flex rounded-2xl overflow-hidden gap-[1px]">
            {ideasArray.map((item) => (
              // 39px: 4+32+3
              <div className="relative h-[141px] w-[calc((100vw-39px)/4)]" key={item.title}>
                <Image src={item.image} alt="search suggestion" fill sizes="calc(25vw - 10px)" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 mb-5 mx-4">
          <div className="m-0.5 text-xs">Popular in pinterest</div>
          <div className="flex items-center justify-between">
            <h5 className="m-0.5 font-medium">Above the sky</h5>
            <FiChevronRight className="w-5 h-5" />
          </div>
          <div className="flex rounded-2xl overflow-hidden gap-[1px]">
            {popularArray.map((item) => (
              <div className="relative h-[141px] w-[calc((100vw-39px)/4)]" key={item.title}>
                <Image src={item.image} alt="search suggestion" fill sizes="calc(25vw - 10px)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
