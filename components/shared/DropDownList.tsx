// this component will add a dropdown list directly to document.body
"use client"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { FaCheck } from "react-icons/fa"
import { Option } from "@/lib/types"
import { throttle } from "lodash"

interface Position {
  // offsetX and horizontalMiddle are incompatible, so are offsetY and verticalMiddle
  offsetX?: number
  offsetY?: number
  horizontalMiddle?: boolean
  verticalMiddle?: boolean
}
interface Props {
  options: Array<Option>
  position?: Position
  followScrolling?: boolean // Whether dropdown list will follow the origin when nested containers scroll (except for document.body)
  title?: string // Title will be shown on top of options
  className?: string
  setShowDropDownFromParent?: React.Dispatch<React.SetStateAction<boolean>> // sometimes parents components need to know if the dropdown list is being shown
  children: React.ReactNode // The button that toggles the dropdown list. Also used as the position origin

  showCheckMark?: boolean
  activeOption?: string
}

export default function DropDownList({
  options,
  position = { offsetX: 0, offsetY: 0, horizontalMiddle: true, verticalMiddle: false },
  followScrolling = false,
  title,
  className,
  children,
  setShowDropDownFromParent,
  showCheckMark = false,
  activeOption,
}: Props) {
  // by default, give the first option a darker background color. Don't know why, just imitate Pinterest
  const firstOptionRef = useRef<HTMLDivElement>(null)
  function handleMouseEnter() {
    if (firstOptionRef.current) {
      firstOptionRef.current.classList.remove("bg-gray-bg-4")
    }
  }
  function beforeMouseEnter() {
    if (firstOptionRef.current) {
      firstOptionRef.current.classList.add("bg-gray-bg-4")
    }
  }

  const originRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showDropDown, setShowDropDown] = useState(false)

  const placeContainer = useCallback(() => {
    const origin = originRef.current
    const container = containerRef.current
    if (!origin || !container) return

    const { offsetX = 0, offsetY = 0, horizontalMiddle = true, verticalMiddle = false } = position
    const { left, top, width: originWidth, height: originHeight } = origin.getBoundingClientRect()
    const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect()

    let transformX = "0px",
      transformY = "0px"

    if (horizontalMiddle) {
      container.style.left = originWidth * 0.5 + "px"
      transformX = left + offsetX - containerWidth * 0.5 + "px"
    } else {
      transformX = left + offsetX + "px"
    }
    if (verticalMiddle) {
      container.style.top = originHeight * 0.5 + "px"
      transformY = top + offsetY - containerHeight * 0.5 + window.scrollY + "px"
    } else {
      transformY = top + offsetY + window.scrollY + "px"
    }

    container.style.transform = `translate(${transformX}, ${transformY})`
  }, [position])

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const origin = originRef.current
      const container = containerRef.current
      if (!origin || !container) return

      if (!container.contains(event.target as Node) && !origin.contains(event.target as Node)) {
        setShowDropDown(false)
        setShowDropDownFromParent && setShowDropDownFromParent(false)
      }
    },
    [setShowDropDownFromParent]
  )

  // make dropdown list follow the position change caused by any parent's scrolling
  const handleScroll = useCallback(throttle(placeContainer, 15), [])
  useEffect(() => {
    const origin = originRef.current
    if (!followScrolling || !origin) return

    const records: HTMLElement[] = []
    let parent = origin.parentElement
    while (parent) {
      const { overflowY } = getComputedStyle(parent)
      if (overflowY === "auto" || overflowY === "scroll") {
        parent.addEventListener("scroll", handleScroll)
        records.push(parent)
      }
      parent = parent.parentElement
    }

    return () => {
      records.forEach((item) => {
        item.removeEventListener("scroll", handleScroll)
      })
    }
  }, [showDropDown, followScrolling, handleScroll])

  // place the drop down list container, add handler for clicking outside
  useLayoutEffect(() => {
    const origin = originRef.current
    const container = containerRef.current
    if (!origin || !showDropDown || !container) return

    placeContainer()

    setTimeout(() => {
      beforeMouseEnter()
    })

    if (window.innerWidth >= 820 && showDropDown) {
      document.addEventListener("click", handleClickOutside)
    } else {
      document.removeEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [showDropDown, handleClickOutside, placeContainer])

  function handleClick(item: Option) {
    item.callback && item.callback()
  }

  return (
    <>
      <div
        ref={originRef}
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation()
          event.nativeEvent.stopImmediatePropagation()
          setShowDropDown((prev) => !prev)
        }}>
        {children}
      </div>

      {showDropDown &&
        createPortal(
          <div
            ref={containerRef}
            className={`absolute top-0 left-0 z-[120] bg-white p-2 rounded-2xl shadow-small ${className}`}
            onMouseEnter={handleMouseEnter}>
            {title && <div className="p-2 text-xs font-light">{title}</div>}
            {options.map((item, index) => (
              <div
                ref={index === 0 ? firstOptionRef : null}
                key={item.label}
                className={`flex items-center justify-between min-w-44 p-2 pr-5 text-base font-medium rounded-lg hover:bg-gray-bg-4
                text-black cursor-pointer
                `}
                onClick={(event: React.MouseEvent) => {
                  event.nativeEvent.stopImmediatePropagation()
                  event.stopPropagation()
                  handleClick(item)
                  setShowDropDown(false)
                }}>
                <span>{item.label}</span>
                {showCheckMark && item.label === activeOption && <FaCheck />}
              </div>
            ))}
          </div>,
          document.body
        )}
    </>
  )
}
