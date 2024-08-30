// this component is only for mobile devices
"use client"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "../shared/Button"
import dynamic from "next/dynamic"
const OptionListMobile = dynamic(() => import("../mobile/OptionListMobile"), { ssr: false })
import { useAppSelector } from "@/lib/store/hook"
import { Option } from "@/lib/types"

interface Props {
  options: Option[]
}
export default function OptionButtonMobile({ options }: Props) {
  const intersectionState = useAppSelector((store) => store.intersection.observers.OptionButtonMobile)

  let visibilityClass = ""
  if (intersectionState === "enter-top") {
    visibilityClass = "visible"
  } else if (intersectionState === "leave-top") {
    visibilityClass = "invisible"
  }

  if (window.innerWidth >= 820) return null
  return (
    <div className={visibilityClass}>
      <OptionListMobile options={options}>
        <Button bgColor="translucent" rounded>
          <TfiMoreAlt className="w-5 h-5" />
        </Button>
      </OptionListMobile>
    </div>
  )
}
