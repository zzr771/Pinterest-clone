/*
    All cards are positioned in one common container, rather than each column has its
  own container.
    Use 'transform: translate()' and change its value to realize transition effect, 
  whick will trigger hardware acceleration. 
*/
"use client"
import { useEffect, useRef, useState } from "react"
import { DocumentNode, useLazyQuery, useQuery } from "@apollo/client"
import PinCard from "@/components/cards/PinCard"
import { getCardNumberLimit, getImageDisplaySize, handleApolloRequestError } from "@/lib/utils"
import { useAppSelector } from "@/lib/store/hook"
import Loading from "../shared/Loading"
import pinRequests from "@/lib/apolloRequests/pin.request"
import { useRouter, useSearchParams } from "next/navigation"

// For taking out data from server's response
const map = {
  FETCH_PINS: "pins",
  FETCH_USER_CREATED_PINS: "userCreatedPins",
  FETCH_USER_SAVED_PINS: "userSavedPins",
  SEARCH_PINS: "searchPins",
}
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
  // Optional values are the keys of the 'pinRequests' object in "@/lib/apolloRequests/pin.request"
  requestName: "FETCH_PINS" | "FETCH_USER_CREATED_PINS" | "FETCH_USER_SAVED_PINS" | "SEARCH_PINS"
  // Includes 'userId' or 'searchString'
  param?: Object
}
export default function WaterFall({ requestName, param }: Props) {
  const userSaved = useAppSelector((store) => store.user.saved)
  const [pins, setPins] = useState<PinCard[]>([])
  const screenSize = useAppSelector((store) => store.screenSize.screenSize)
  const containterRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<HTMLDivElement>(null)
  const requestMethod = useRef<DocumentNode>(pinRequests[requestName])

  // ----------------------------------------------------------------------------------- Card Positioning
  const columnHeights = useRef<Array<number>>([])
  const columnNumber = useRef(0)
  const prevColumnNumber = useRef(-1)
  const positionedCardNumber = useRef(0)
  const cardWidth = useRef(0)
  const cardPaddingBottom = useRef(0)
  const cardTitlePartHeight = useRef(0)
  const cardAuthorPartHeight = useRef(0)

  function setCardSizeData() {
    if (screenSize < 540) {
      cardWidth.current = Math.round((screenSize - 8) / 2) // 8: container's padding (containterRef)
      cardPaddingBottom.current = 8
      cardTitlePartHeight.current = 24
      cardAuthorPartHeight.current = 40
    } else if (screenSize < 820) {
      cardWidth.current = Math.round((screenSize - 8) / 3) // 8: container's padding (containterRef)
      cardPaddingBottom.current = 8
      cardTitlePartHeight.current = 24
      cardAuthorPartHeight.current = 40
    } else {
      cardWidth.current = 252
      cardPaddingBottom.current = 16
      cardTitlePartHeight.current = 26
      cardAuthorPartHeight.current = 40
    }
  }

  function setContainerWidth() {
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
      console.log(pins[i].title)
      const shortestColumnIndex = findShortestColumn()
      const { height } = pins[i].imageSize
      const transformY = columnHeights.current[shortestColumnIndex]
      const transformX = shortestColumnIndex * cardWidth.current
      const titleHeight = pins[i].title.length > 0 ? cardTitlePartHeight.current : 0
      columnHeights.current[shortestColumnIndex] +=
        height + cardPaddingBottom.current + cardAuthorPartHeight.current + titleHeight

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

    setCardSizeData()
    containterRef.current.style.width = setContainerWidth()
    // if 'columnNumber' doesn't change, there is no need to place all the cards again
    if (prevColumnNumber.current === columnNumber.current) return

    prevColumnNumber.current = columnNumber.current
    columnHeights.current = new Array(columnNumber.current).fill(0)

    if (!pins.length) return
    placeCardsFromIndex(0)
  }, [screenSize])

  // ----------------------------------------------------------------------------------- Fetch Data
  const [isInitialRequestOver, setIsInitialRequestOver] = useState(false)
  const [isNoMoreCard, setIsNoMoreCard] = useState(false)
  const { loading: initialLoading, data: initialData } = useQuery(requestMethod.current, {
    variables: {
      currentNumber: 0,
      limit: getCardNumberLimit(screenSize),
      ...param,
    },
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })
  useEffect(() => {
    if (initialLoading || !initialData) return

    let initialPins = initialData[map[requestName]]
    initialPins = initialPins.map((item: PinCard) => {
      const { width, height } = getImageDisplaySize(item.imageSize)
      return { ...item, imageSize: { width, height } }
    })
    setPins(initialPins)
    setIsInitialRequestOver(true)
  }, [initialLoading])

  const [fetchMoreCards] = useLazyQuery(requestMethod.current, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })
  async function addCards() {
    console.log(isNoMoreCard)
    if (!isInitialRequestOver || isNoMoreCard) return

    const { data } = await fetchMoreCards({
      variables: {
        currentNumber: pins.length,
        limit: getCardNumberLimit(screenSize),
        ...param,
      },
    })

    let subsequentPins = data[map[requestName]]
    if (subsequentPins.length === 0) {
      setIsNoMoreCard(true)
      return
    }
    subsequentPins = subsequentPins.map((item: PinCard) => {
      const { width, height } = getImageDisplaySize(item.imageSize)
      return { ...item, imageSize: { width, height } }
    })
    setPins((prev) => prev.concat(subsequentPins))
  }

  /*
      Every time the state pins changes, the IntersectionObserver must be recreated to update
    its callback. Because the callback is in a closure where 'pins' never changes.
      In the callback, we invoke 'addCards' in which 'pins' is used.
  */
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio > 0) {
        addCards()
      }
    })
    if (containterRef.current) {
      intersectionObserver.observe(observerRef.current as Element)
    }
    return () => {
      intersectionObserver.disconnect()
    }
  }, [pins])

  // const keyword = useSearchParams().get("q")
  // const router = useRouter()
  // useEffect(() => {
  //   if (requestName === "SEARCH_PINS") {
  //     // router.refresh()
  //     // setPins([])
  //     // addCards()
  //   }
  // }, [keyword])

  // // useEffect(() => {
  // //   console.log("[]")
  // // }, [])

  return (
    <div className="w-full relative max-w3:pb-[70px]">
      {initialLoading && <Loading />}
      <div ref={containterRef} className="relative w3:mx-auto px-1">
        {requestName === "SEARCH_PINS" && pins.length === 0 && (
          <div className="mx-auto mt-[35vh] text-center text-lg text-black">
            <p className="mb-3">Sorry, no matched results.</p>
          </div>
        )}
        {pins.length > 0 &&
          pins.map((pin) => (
            <PinCard key={pin._id} pin={pin} isSaved={(userSaved && userSaved.includes(pin._id)) || false} />
          ))}
      </div>
      <div ref={observerRef} className="w-full h-screen absolute bottom-0 z-[-1]"></div>
    </div>
  )
}
