import Button from "@/components/shared/Button"
import { FaRegComment } from "react-icons/fa"
import { useAppSelector } from "@/lib/store/hook"
import { useEffect, useState } from "react"

interface Props {
  setshowCommentsMobile: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ButtonsMobile({ setshowCommentsMobile }: Props) {
  const intersectionState = useAppSelector((state) => state.intersection.observers.NavBarBottom)
  const [positionClass, setPositionClass] = useState("")

  useEffect(() => {
    if (intersectionState === "enter-bottom") {
      setPositionClass("static")
    } else if (intersectionState === "leave-bottom") {
      setPositionClass("fixed z-[110] bottom-0 left-0 right-0 shadow-small")
    }
  }, [intersectionState])

  return (
    <div className="h-16">
      <div className={`flex justify-between items-center px-4 py-2 bg-white ${positionClass}`}>
        <Button clickEffect rounded click={() => setshowCommentsMobile(true)}>
          <FaRegComment className="w-7 h-7" />
        </Button>
        <Button text="Save" bgColor="red" clickEffect />
      </div>
    </div>
  )
}
