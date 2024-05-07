/*
    All cards are positioned in one common container, rather than each column has its
  own container.
    Use 'transform: translate()' and change its value to realize transition effect, 
  whick will trigger hardware acceleration. 
*/
"use client"
import { useEffect, useRef, useState } from "react"
import { DocumentNode, useQuery } from "@apollo/client"
import PinCard from "@/components/cards/PinCard"
import { getCardNumberLimit, getImageDisplaySize, handleApolloRequestError } from "@/lib/utils"
import { useAppSelector } from "@/lib/store/hook"
import Loading from "../shared/Loading"
import pinRequests from "@/lib/apolloRequests/pin.request"

interface PinCard {
  _id: string
  author: {
    _id: string
    firstName: string
    lastName: string
    imageUrl: string
  }
  imageUrl: string
  imageSize: {
    width: number
    height: number
  }
  title: string
  link: string
}
interface Props {
  // Optional values are the keys of the 'pinRequests' object from "@/lib/apolloRequests/pin.request"
  requestName: "FETCH_PINS"
}

export default function WaterFall({ requestName }: { requestName: string }) {
  const user = useAppSelector((store) => store.user.user)
  const [pins, setPins] = useState<PinCard[]>([])
  const screenSize = useAppSelector((store) => store.screenSize.screenSize)
  const containterRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<HTMLDivElement>(null)
  const requestMethod = useRef<DocumentNode>(pinRequests[requestName])

  // for position calculation
  const columnHeights = useRef<Array<number>>([])
  const columnNumber = useRef(0)
  const prevColumnNumber = useRef(-1)
  const positionedCardNumber = useRef(0)
  const cardWidth = useRef(0)
  const cardPaddingBottom = useRef(0)
  const cardAuthorPartHeight = useRef(0)

  const { loading: initialLoading, data: initialData } = useQuery(requestMethod.current, {
    variables: {
      currentNumber: 0,
      limit: getCardNumberLimit(screenSize),
    },
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })

  function calculateCardSize() {
    const rem = parseInt(getComputedStyle(document.documentElement).fontSize)
    if (screenSize < 540) {
      cardWidth.current = Math.round((screenSize - 8) / 2) // 8: container's padding (containterRef)
      cardPaddingBottom.current = 8
      cardAuthorPartHeight.current = 4 * rem
    } else if (screenSize < 820) {
      cardWidth.current = Math.round((screenSize - 8) / 3) // 8: container's padding (containterRef)
      cardPaddingBottom.current = 8
      cardAuthorPartHeight.current = 4 * rem
    } else {
      cardWidth.current = 252
      cardPaddingBottom.current = 16
      cardAuthorPartHeight.current = 78
    }
  }

  function calculateContainerWidthAndColumnNumber() {
    if (screenSize < 540) {
      columnNumber.current = 2
      return "100%"
    } else if (screenSize < 820) {
      columnNumber.current = 3
      return "100%"
    } else {
      columnNumber.current = Math.floor((screenSize - 14) / cardWidth.current) // 14: the width of the scroll bar
      return columnNumber.current * cardWidth.current + "px"
    }
  }

  function placeCardsFromIndex(index: number) {
    for (let i = index; i < pins.length; i++) {
      const shortestColumnIndex = findShortestColumn()
      const { height } = pins[i].imageSize
      const transformY = columnHeights.current[shortestColumnIndex]
      const transformX = shortestColumnIndex * cardWidth.current
      columnHeights.current[shortestColumnIndex] +=
        height + cardPaddingBottom.current + cardAuthorPartHeight.current

      if (containterRef.current) {
        ;(
          containterRef.current.children[i] as HTMLDivElement
        ).style.transform = `translate(${transformX}px, ${transformY}px)`
      }
    }
  }
  function findShortestColumn() {
    return columnHeights.current.indexOf(Math.min(...columnHeights.current))
  }
  function getTallestHeight() {
    return Math.max(...columnHeights.current)
  }

  async function addCards() {
    // if (pins.length === 0) return
    // const result = await getMorePinCardImgs(screenSize)
    // result.forEach((item) => {
    //   const { width, height } = getImageDisplaySize(item)
    //   item.width = width
    //   item.height = height
    // })
    // setPins((prev) => prev.concat(result))
  }

  // fetch initial data
  useEffect(() => {
    if (initialLoading || !initialData) return
    let pins = initialData.pins
    pins = pins.map((item: PinCard) => {
      const { width, height } = getImageDisplaySize(item.imageSize)
      return { ...item, imageSize: { width, height } }
    })

    setPins(pins)
  }, [initialLoading])

  /*
      Every time the state pins changes, the IntersectionObserver must be recreated to update
    its callback. Because the callback is in a closure where 'pins' will never change.
      In the callback, we invoke 'addCards' in which 'pins' is used.
  */
  useEffect(() => {
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
  }, [pins])

  // place new cards when 'pins' changes
  useEffect(() => {
    if (!containterRef.current || !pins.length) return

    placeCardsFromIndex(positionedCardNumber.current)
    containterRef.current.style.height = getTallestHeight() + "px"
    positionedCardNumber.current = pins.length
  }, [pins])

  // place all cards when 'screenSize' changes significantly ('columnNumber' changes)
  useEffect(() => {
    if (!containterRef.current) return

    calculateCardSize()
    containterRef.current.style.width = calculateContainerWidthAndColumnNumber()
    // if 'columnNumber' doesn't change, there is no need to place all the cards again
    if (prevColumnNumber.current === columnNumber.current) return

    prevColumnNumber.current = columnNumber.current
    columnHeights.current = new Array(columnNumber.current).fill(0)

    if (!pins.length) return
    placeCardsFromIndex(0)
  }, [screenSize])

  return (
    <section className="w-full relative">
      {initialLoading && <Loading />}
      <div ref={containterRef} className="relative w3:mx-auto px-1">
        {pins.length > 0 &&
          pins.map((pin) => (
            <PinCard key={pin._id} pin={pin} isSavedInitial={user?.saved?.includes(pin._id) || false} />
          ))}
      </div>
      <div ref={observerRef} className="w-full h-screen absolute bottom-0 z-[-1]"></div>
    </section>
  )
}
