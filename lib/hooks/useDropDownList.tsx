/*
  Function:
    When a user clicks outside the drop down button or the drop down list,
  hide the list.
*/
import { useCallback, useEffect } from "react"

interface Props {
  dropContainerRef: React.RefObject<HTMLDivElement> // this container must contain both the button and <DropDownList />
  showDropDownList: boolean // state
  setShowDropDownList: React.Dispatch<React.SetStateAction<boolean>> // setState function
}
export default function useDropDownList({ dropContainerRef, showDropDownList, setShowDropDownList }: Props) {
  const callback = useCallback((event: MouseEvent) => {
    const dropContainer = dropContainerRef.current
    if (!dropContainer) return

    if (!dropContainer.contains(event.target as Node)) {
      setShowDropDownList(false)
    }
  }, [])
  useEffect(() => {
    if (window.innerWidth >= 820 && showDropDownList) {
      document.addEventListener("click", callback)
    } else {
      document.removeEventListener("click", callback)
    }

    return () => {
      document.removeEventListener("click", callback)
    }
  }, [showDropDownList])
}
