"use client"
import { useLayoutEffect, useState } from "react"
import SlideBanner from "./_components/SlideBanner"
import SearchBar from "./_components/SearchBar"
import { ideasArray, popularArray } from "@/constants/index"
import { FiChevronRight } from "react-icons/fi"
import Image from "next/image"
import WaterFall from "@/components/layout/WaterFall"

interface Props {
  searchParams: {
    q: string
  }
}
export default function Page({ searchParams }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  const keyword = searchParams["q"]?.trim()
  useLayoutEffect(() => {
    if (window.innerWidth <= 820) {
      setIsMobile(true)
    }
  }, [])
  return (
    <>
      {!isMobile && (
        <main className="w3:mt-20">
          <WaterFall requestName={"SEARCH_PINS"} param={{ keyword }} />
        </main>
      )}
      {isMobile && (
        <main>
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
        </main>
      )}
    </>
  )
}
