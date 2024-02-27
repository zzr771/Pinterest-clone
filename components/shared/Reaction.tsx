import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { HiOutlineHeart } from "react-icons/hi"
import Button from "./Button"
import ToolTip from "./ToolTip"
import { reactionIcons } from "@/constants/index"

export default function Reaction() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reactionBoxRef = useRef<HTMLDivElement>(null)
  const [showBox, setShowBox] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    containerRef.current.addEventListener("mouseenter", () => {
      setShowBox(true)
    })
    containerRef.current.addEventListener("mouseleave", () => {
      setShowBox(false)
    })
  }, [])

  useLayoutEffect(() => {
    const box = reactionBoxRef.current
    if (!showBox || !box) return

    const { right } = box.getBoundingClientRect()
    // if the box is very close to the right edge of the screen, move it to the left
    if (window.innerWidth - right < 20) {
      box.style.left = "-82px"
    }
  }, [showBox])

  useEffect(() => {
    setTimeout(() => {
      if (!showBox || !containerRef.current) return
      const reactions = containerRef.current.querySelectorAll(".reaction")
      reactions.forEach((reaction) => {
        reaction.classList.add("reaction-end")
      })
    }, 100)
  }, [showBox])

  return (
    <div ref={containerRef} className="relative">
      <ToolTip text="React">
        <Button bgColor="gray" rounded>
          <HiOutlineHeart className="w-7 h-7" />
        </Button>
      </ToolTip>

      {/* 
          There should be a small gap between the heart icon and the reaction box.
        But when the mouse leaves the icon and tries to get into the box, it will pass
        the gap, which will trigger the 'mouseleave' event on containerRef. 
          To prevent the undesirable trigger, give the box an outer container with some 
        bottom padding. The padding overlaps the upper part of the icon, so the mouse
        won't leave the container when it moves between the icon and the box.
      */}
      {showBox && (
        <div
          ref={reactionBoxRef}
          className="horizontal-middle top-[-86px] w-[300px] h-[96px] pb-4 cursor-pointer">
          <div className="flex justify-around items-center h-full rounded-full shadow-large px-5 bg-white">
            {reactionIcons.map((item, index) => (
              <ToolTip key={item.name} text={item.name} position="top" extraGap={45}>
                <div className="h-10 w-10 reaction-container">
                  <div
                    style={{ backgroundImage: `url(${item.src})`, transitionDelay: `${index * 0.08}s` }}
                    className="h-10 w-10 bg-no-repeat bg-cover reaction reaction-start"></div>
                </div>
              </ToolTip>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
