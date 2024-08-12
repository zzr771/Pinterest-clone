"use client"
import { useLayoutEffect, useState } from "react"
import SlideBannerMobile from "./_components/SlideBannerMobile"
import SearchBarMobile from "./_components/SearchBarMobile"
import { ideasArray, popularArray } from "@/constants/index"
import { FiChevronRight } from "react-icons/fi"
import Image from "next/image"
import WaterFall from "@/components/layout/WaterFall"

/*
    In this route, we use dynamic route instead of search params, because we want 
  next.js to cache the results of every search. 
    For instance, a user searches for "light", then searches for "beach", then clicks
  the browser's 'back' button. We hope that the contents about 'light' can be cached 
  so they can be displayed instantly.
    But next.js's router cache ignores search params. "/search?q=1" and "/search?q=2"
  means no difference to it. It only caches '/search' with the search param that you
  use to visit this route for the first time. In this case, it caches '/search?q=light'
  and doesn't cache '/search?q=beach'.
    So we use dynamic route instead.
*/
export default function Page({ params }: { params: { keyword: string } }) {
  const { keyword } = params
  const [isMobile, setIsMobile] = useState(false)
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
          <SearchBarMobile />
          <SlideBannerMobile />

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
