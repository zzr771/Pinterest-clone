// this component is only for mobile devices
"use client"
import { useRef, useState } from "react"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "../shared/Button"
import dynamic from "next/dynamic"
const OptionListMobile = dynamic(() => import("../mobile/OptionListMobile"), { ssr: false })
import { Option } from "@/lib/types"
import { useAppSelector } from "@/lib/store/hook"

export default function OptionButtonMobile() {
  if (window.innerWidth >= 820) return null

  const intersectionState = useAppSelector((state) => state.intersection.observers.OptionButtonMobile)
  const options = useRef<Option[]>([{ label: "Hide Pin" }, { label: "Delete Pin" }])

  let visibilityClass = ""
  if (intersectionState === "enter-top") {
    visibilityClass = "visible"
  } else if (intersectionState === "leave-top") {
    visibilityClass = "invisible"
  }

  return (
    <div className={visibilityClass}>
      <OptionListMobile options={options.current}>
        <Button bgColor="translucent" rounded>
          <TfiMoreAlt className="w-5 h-5" />
        </Button>
      </OptionListMobile>
    </div>
  )
}
