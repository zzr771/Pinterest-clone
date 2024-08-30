/*
    All cards are positioned in one common container, rather than each column has its
  own container.
    Use 'transform: translate()' and change its value to realize transition effect, 
  whick will trigger hardware acceleration. 
*/
"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { DocumentNode, useLazyQuery, useQuery } from "@apollo/client"
import PinCard from "@/components/cards/PinCard"
import { getCardNumberLimit, getImageDisplaySize, handleApolloRequestError } from "@/lib/utils"
import { useAppSelector } from "@/lib/store/hook"
import pinRequests from "@/lib/apolloRequests/pin.request"
import { PinCardInfo } from "@/lib/types"
import { usePathname } from "next/navigation"
import { debug } from "console"

// For taking out data from server's response
const map = {
  FETCH_PINS: "pins",
  FETCH_USER_CREATED_PINS: "userCreatedPins",
  FETCH_USER_SAVED_PINS: "userSavedPins",
  SEARCH_PINS: "searchPins",
}
interface Props {
  // Optional values are the keys of the 'pinRequests' object in "@/lib/apolloRequests/pin.request"
  requestName: "FETCH_PINS" | "FETCH_USER_CREATED_PINS" | "FETCH_USER_SAVED_PINS" | "SEARCH_PINS"
  // Includes 'userId' or 'searchString'
  param?: Object
}
export default function WaterFall({ requestName, param }: Props) {
  const userSaved = useAppSelector((store) => store.user.saved)
  const [pins, setPins] = useState<PinCardInfo[]>([])
  const screenSize = useAppSelector((store) => store.screenSize.screenSize)
  const containterRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<HTMLDivElement>(null)
  const requestMethod = useRef<DocumentNode>(pinRequests[requestName])
  const pathName = usePathname()

  // ----------------------------------------------------------------------------------- Card Positioning
  const columnHeights = useRef<Array<number>>([])
  const columnNumber = useRef(0)
  const prevColumnNumber = useRef(-1)
  const positionedCardNumber = useRef(0)
  const cardWidth = useRef(0)
  const cardPaddingBottom = useRef(0)
  const cardTitlePartHeight = useRef(0)
  const cardAuthorPartHeight = useRef(0)

  const setCardSizeData = useCallback(() => {
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
  }, [screenSize])

  const setContainerWidth = useCallback(() => {
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
  }, [screenSize])

  // ------------------------------------------------------------------------------ place new cards when 'pins' changes
  function findShortestColumn() {
    return columnHeights.current.indexOf(Math.min(...columnHeights.current))
  }
  function getTallestHeight() {
    return Math.max(...columnHeights.current)
  }
  const placeCardsFromIndex = useCallback(
    (index: number) => {
      for (let i = index; i < pins.length; i++) {
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
    },
    [pins]
  )
  useEffect(() => {
    if (!containterRef.current || !pins.length) return

    placeCardsFromIndex(positionedCardNumber.current)
    containterRef.current.style.height = getTallestHeight() + "px"
    positionedCardNumber.current = pins.length
  }, [pins, placeCardsFromIndex])

  // place all cards when 'screenSize' changes significantly ('columnNumber' changes)
  useEffect(() => {
    if (!containterRef.current) return

    setCardSizeData()
    containterRef.current.style.width = setContainerWidth()
    // if 'columnNumber' doesn't change, there is no need to place all the cards again
    if (prevColumnNumber.current === columnNumber.current) return

    prevColumnNumber.current = columnNumber.current
    columnHeights.current = new Array(columnNumber.current).fill(0)

    placeCardsFromIndex(0)
  }, [screenSize, setCardSizeData, setContainerWidth, placeCardsFromIndex])

  // ----------------------------------------------------------------------------------- Fetch Data
  const isNoMoreCard = useRef(false)
  const isInitialRequestOver = useRef(false)
  const cardNumber = useRef(0)

  const cardNumberLimit = useRef(getCardNumberLimit(screenSize))
  useEffect(() => {
    cardNumberLimit.current = getCardNumberLimit(screenSize)
  }, [screenSize])

  const { loading: initialLoading, data: initialData } = useQuery(requestMethod.current, {
    variables: {
      currentNumber: 0,
      limit: cardNumberLimit.current,
      ...param,
    },
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })

  // fetch initial data
  useEffect(() => {
    if (initialLoading || !initialData) return

    let initialPins = initialData[map[requestName]]
    initialPins = initialPins.map((item: PinCardInfo) => {
      const { width, height } = getImageDisplaySize(item.imageSize)
      return { ...item, imageSize: { width, height } }
    })

    setPins(initialPins)
    cardNumber.current += initialPins.length
    isInitialRequestOver.current = true
  }, [initialLoading, initialData, requestName])

  const [fetchMoreCards] = useLazyQuery(requestMethod.current, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })

  const addCards = useCallback(async () => {
    if (!isInitialRequestOver.current || isNoMoreCard.current) return

    const { data } = await fetchMoreCards({
      variables: {
        /*
            Sometimes, the 'addCards' function is invoked so closely after the initial query that 'pins' 
          has not been updated yet. So we use 'cardNumber.current' instead of 'pins.length'.
        */
        currentNumber: cardNumber.current,
        limit: cardNumberLimit.current,
        ...param,
      },
    })

    let subsequentPins = data[map[requestName]]
    if (subsequentPins.length === 0) {
      isNoMoreCard.current = true
      return
    }
    subsequentPins = subsequentPins.map((item: PinCardInfo) => {
      const { width, height } = getImageDisplaySize(item.imageSize)
      return { ...item, imageSize: { width, height } }
    })
    setPins((prev) => prev.concat(subsequentPins))
    cardNumber.current += subsequentPins.length
  }, [fetchMoreCards, param, requestName])

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
  }, [pins, addCards])

  return (
    <div className="w-full relative max-w3:pb-[70px]">
      {initialLoading && (
        <div className="absolute top-[30vh] max-w3:top-[48vh] horizontal-middle">
          <svg
            aria-label="Loading Search Results"
            className="loading-spinner"
            height="40"
            role="img"
            viewBox="0 0 24 24"
            width="40">
            <path d="M15 10.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m-6-6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24"></path>
          </svg>
        </div>
      )}

      <div ref={containterRef} className="relative w3:mx-auto px-1">
        {!initialLoading && requestName === "SEARCH_PINS" && initialData[map[requestName]].length === 0 && (
          <div className="mx-auto mt-[35vh] text-center text-lg text-black">
            <p className="mb-3">Sorry, no matched results.</p>
          </div>
        )}
        {!initialLoading && initialData[map[requestName]].length === 0 && (
          <div className="mx-auto mt-[5vh] text-center text-lg text-gray-font-4 max-w3:text-base max-w3:mx-5">
            {requestName === "FETCH_USER_CREATED_PINS" && (
              <p className="mb-3">
                It looks like you haven{"'"}t created anything yet. Share your first pin now!
              </p>
            )}
            {requestName === "FETCH_USER_SAVED_PINS" && (
              <p className="mb-3">No saved pins. Explore and save the content you love!</p>
            )}
          </div>
        )}
        {pins.map((pin) => (
          <PinCard key={pin._id} pin={pin} isSaved={(userSaved && userSaved.includes(pin._id)) || false} />
        ))}
      </div>
      <div ref={observerRef} className="w-full h-screen absolute bottom-0 z-[-1]"></div>
    </div>
  )
}
