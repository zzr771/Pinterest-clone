"use client"
import { useEffect, useRef, useState } from "react"
import { FaCheck } from "react-icons/fa"
import { Option } from "@/lib/types"

interface Props {
  options: Array<Option>
  title?: string
  onSelectionChange?: (activeOption: string) => void
  showCheckMark?: boolean
  defaultOption?: string
  className?: string
}

// accept a button and options. When click the button, show a list
export default function DropDownList({
  options,
  title,
  onSelectionChange,
  showCheckMark = false,
  defaultOption,
  className,
}: Props) {
  const [activeOption, setActiveOption] = useState<string>(defaultOption || options[0].label)
  const firstOptionRef = useRef<HTMLDivElement>(null)

  function handleClick(item: Option) {
    setActiveOption(item.label)
    item.callback && item.callback()
  }

  // by default, give the first option a darker background color. Don't know why, just imitate Pinterest
  function handleMouseEnter() {
    if (firstOptionRef.current) {
      firstOptionRef.current.classList.remove("bg-gray-bg-4")
    }
  }
  useEffect(() => {
    if (firstOptionRef.current) {
      firstOptionRef.current.classList.add("bg-gray-bg-4")
    }
  }, [])

  useEffect(() => {
    onSelectionChange && onSelectionChange(activeOption)
  }, [activeOption])

  return (
    <div className={`bg-white p-2 rounded-2xl shadow-small ${className}`} onMouseEnter={handleMouseEnter}>
      {title && <div className="p-2 text-xs font-light">{title}</div>}
      {options.map((item, index) => (
        <div
          ref={index === 0 ? firstOptionRef : null}
          key={item.label}
          className={`flex items-center justify-between min-w-44 p-2 pr-5 text-base font-medium rounded-lg hover:bg-gray-bg-4
            text-black cursor-pointer
            `}
          onClick={(event) => {
            event.stopPropagation()
            handleClick(item)
          }}>
          <span>{item.label}</span>
          {showCheckMark && item.label === activeOption && <FaCheck />}
        </div>
      ))}
    </div>
  )
}
