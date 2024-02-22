"use client"
import { Suspense, useEffect, useRef, useState } from "react"
import PinCard from "@/components/cards/PinCard"
import { getInitialPinCardImgs, getMorePinCardImgs } from "@/contants/index"
import { getImageDisplaySize } from "@/lib/utils"
import { useAppSelector } from "@/lib/store/hook"
import Loading from "../shared/Loading"

/*
  All cards are positioned in one common container, rather than each column has its
  own container.

  Use 'transform: translate()' and change its value to realize transition effect, 
    whick will trigger hardware acceleration. 
*/
interface Image {
  id: string
  src: string
  width: number
  height: number
}

export default function WaterFall() {
  const [imgs, setImgs] = useState<Image[]>([])
  const containterRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<HTMLDivElement>(null)
  const screenSize = useAppSelector((state: any) => state.screenSize.screenSize)

  let columnHeights: Array<number> // record the height of each column
  let columnNumber: number
  let cardWidth: number, cardPaddingBottom: number, cardAuthorPartHeight: number
  let totalCardNumber = 0

  function calculateCardSize() {
    const rem = parseInt(getComputedStyle(document.documentElement).fontSize)
    if (screenSize < 540) {
      cardWidth = Math.round((screenSize - 8) / 2) // 8: container's padding (containterRef)
      cardPaddingBottom = 8
      cardAuthorPartHeight = 4 * rem
    } else if (screenSize < 820) {
      cardWidth = Math.round((screenSize - 8) / 3) // 8: container's padding (containterRef)
      cardPaddingBottom = 8
      cardAuthorPartHeight = 4 * rem
    } else {
      cardWidth = 252
      cardPaddingBottom = 16
      cardAuthorPartHeight = 78
    }
  }

  function calculateContainerWidth() {
    if (screenSize < 540) {
      columnNumber = 2
      return "100%"
    } else if (screenSize < 820) {
      columnNumber = 3
      return "100%"
    } else {
      columnNumber = Math.floor((screenSize - 14) / cardWidth) // 14: the width of the scroll bar
      return columnNumber * cardWidth + "px"
    }
  }

  function placeCards() {
    columnHeights = new Array(columnNumber).fill(0)
    for (let i = totalCardNumber; i < imgs.length; i++) {
      const shortestColumnIndex = findShortestColumn()
      const { height } = imgs[i]
      const transformY = columnHeights[shortestColumnIndex]
      const transformX = shortestColumnIndex * cardWidth
      columnHeights[shortestColumnIndex] += height + cardPaddingBottom + cardAuthorPartHeight

      if (containterRef.current) {
        ;(
          containterRef.current.children[i] as HTMLDivElement
        ).style.transform = `translate(${transformX}px, ${transformY}px)`
      }
    }
  }
  function findShortestColumn() {
    return columnHeights.indexOf(Math.min(...columnHeights))
  }
  function getTallestHeight() {
    return Math.max(...columnHeights)
  }

  async function getImages() {
    const result = await getInitialPinCardImgs(screenSize)
    result.forEach((item) => {
      const { width, height } = getImageDisplaySize(item)
      item.width = width
      item.height = height
    })
    setImgs(result)
  }

  async function addCards() {
    if (imgs.length === 0) return

    const result = await getMorePinCardImgs(screenSize)
    result.forEach((item) => {
      const { width, height } = getImageDisplaySize(item)
      item.width = width
      item.height = height
    })
    setImgs((prev) => prev.concat(result))
  }

  useEffect(() => {
    getImages()
  }, [])

  useEffect(() => {
    /*
    Every time the state imgs changes, the IntersectionObserver must be recreated to update
      its callback. Because the callback is in a closure where the state imgs will never change.
    
    To get the newest imgs, recreation of callback is necessary.
  */
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return
      addCards()
    })
    if (containterRef.current) {
      intersectionObserver.observe(observerRef.current as Element)
    }

    return () => {
      intersectionObserver.disconnect()
    }
  }, [imgs])

  useEffect(() => {
    if (!containterRef.current || imgs.length === 0) return

    calculateCardSize()
    containterRef.current.style.width = calculateContainerWidth()
    placeCards()
    containterRef.current.style.height = getTallestHeight() + "px"

    totalCardNumber = imgs.length
  }, [screenSize, imgs])

  return (
    <section className="w-full relative">
      <Suspense fallback={<Loading />}>
        <div ref={containterRef} className="relative w3:mx-auto px-1">
          {imgs.length > 0 &&
            imgs.map((img) => (
              <PinCard
                key={img.id}
                pinId={img.id}
                image={img.src}
                imageSize={{ width: img.width, height: img.height }}
                title="test"
                author={{ name: "user", avatar: "/assets/test/avatar.jpg" }}
              />
            ))}
        </div>
        <div ref={observerRef} className="w-full h-screen absolute bottom-0 z-[-1]"></div>
      </Suspense>
    </section>
  )
}
