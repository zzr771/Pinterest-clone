import Button from "@/components/shared/Button"
import { FaRegComment } from "react-icons/fa"
import { useAppSelector } from "@/lib/store/hook"
import { useEffect, useMemo, useState } from "react"
import useSavePin from "@/lib/hooks/useSavePin"

interface Props {
  setshowCommentsMobile: React.Dispatch<React.SetStateAction<boolean>>
  pinId: string
}
export default function ButtonsMobile({ setshowCommentsMobile, pinId }: Props) {
  const intersectionState = useAppSelector((store) => store.intersection.observers.NavBarBottom)
  const [positionClass, setPositionClass] = useState("")

  useEffect(() => {
    if (intersectionState === "enter-bottom") {
      setPositionClass("static")
    } else if (intersectionState === "leave-bottom") {
      setPositionClass("fixed z-[110] bottom-0 left-0 right-0 shadow-small")
    }
  }, [intersectionState])

  // -------------------------------------------------------------- Save & Unsave
  const userSaved = useAppSelector((store) => store.user.saved)
  const { savePin, unsavePin } = useSavePin()
  const isSaved = useMemo(() => userSaved && userSaved.includes(pinId), [userSaved])

  return (
    <div className="h-16">
      <div className={`flex justify-between items-center px-4 py-2 bg-white ${positionClass}`}>
        <Button clickEffect rounded click={() => setshowCommentsMobile(true)}>
          <FaRegComment className="w-7 h-7" />
        </Button>
        {userSaved && (
          <Button
            text={isSaved ? "Saved" : "Save"}
            bgColor={isSaved ? "black" : "red"}
            clickEffect
            click={() => {
              isSaved ? unsavePin(pinId) : savePin(pinId)
            }}
          />
        )}
      </div>
    </div>
  )
}
