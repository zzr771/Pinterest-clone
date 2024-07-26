import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { HiOutlineHeart } from "react-icons/hi"
import ToolTip from "./ToolTip"
import { reactionIcons } from "@/constants/index"
import { useAppSelector } from "@/lib/store/hook"
import { ReactionInfoDeep } from "@/lib/types"
import { useMutation } from "@apollo/client"
import { ADD_REACTION, REMOVE_REACTION } from "@/lib/apolloRequests/pin.request"
import { handleApolloRequestError } from "@/lib/utils"
import toast from "react-hot-toast"
import { usePathname } from "next/navigation"

interface Props {
  initialReactions: ReactionInfoDeep[]
}
interface reactionIconInfo {
  id: string
  name: string
  src: string
  bgColor: string
}
export default function Reaction({ initialReactions }: Props) {
  const user = useAppSelector((store) => store.user.user)
  const containerRef = useRef<HTMLDivElement>(null)
  const reactionBoxRef = useRef<HTMLDivElement>(null)
  const pathName = usePathname()

  const [showBox, setShowBox] = useState(false)
  const [reactions, setReactions] = useState(initialReactions)

  const [reactionKinds, setReactionKinds] = useState(getReactionKinds())
  const [currentReactionIcon, setCurrentReactionIcon] = useState<reactionIconInfo | null>(null)

  const [addReactionMutation] = useMutation(ADD_REACTION, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })
  async function handleAddReaction(reactionId: string) {
    if (!user) {
      toast("Please sign in before operation")
      return false
    }

    const {
      data: { addReaction: res },
    } = await addReactionMutation({
      variables: {
        pinId: pathName.split("/").pop(),
        reactionId,
        userId: user._id,
      },
    })

    if (res) {
      const newReaction = {
        reactionId,
        user: {
          _id: user._id,
          firstName: user.firstName,
          imageUrl: user.imageUrl,
        },
      }

      // If the user has already given a reaction, remove the old one and add the new one.
      if (currentReactionIcon) {
        const indexToRemove = reactions.findIndex((item) => item.user._id === user?._id)
        const newReactions = reactions.toSpliced(indexToRemove, 1)
        newReactions.unshift(newReaction)
        setReactions(newReactions)
      } else {
        setReactions((prev) => [newReaction, ...prev])
      }
    } else {
      toast.error("Something went wrong")
    }
  }
  const [removeReactionMutation] = useMutation(REMOVE_REACTION, {
    onError: (error) => {
      handleApolloRequestError(error)
    },
  })
  async function handleRemoveReaction() {
    if (!user) {
      toast("Please sign in before operation")
      return false
    }

    const {
      data: { removeReaction: res },
    } = await removeReactionMutation({
      variables: {
        pinId: pathName.split("/").pop(),
        userId: user._id,
      },
    })

    if (res) {
      const indexToRemove = reactions.findIndex((item) => item.user._id === user?._id)
      const newReactions = reactions.toSpliced(indexToRemove, 1)
      setReactions(newReactions)
      setCurrentReactionIcon(null)
    } else {
      toast.error("Something went wrong")
    }
  }

  // ----------------------------------------------------------------------- Users' Reactions
  function getReactionKinds() {
    const result: string[] = []
    reactions.forEach((item) => {
      if (!result.includes(item.reactionId)) {
        result.push(item.reactionId)
      }
    })
    return result
  }

  function getCurrentReactionIcon() {
    const currentUserReaction = reactions.find((item) => item.user._id === user?._id)
    if (!currentUserReaction) return null

    return reactionIcons.find((item) => item.id === currentUserReaction.reactionId) || null
  }

  useEffect(() => {
    if (!user) return

    const result = getCurrentReactionIcon()
    if (result) {
      setCurrentReactionIcon(result)
    }
  }, [user])

  useEffect(() => {
    setReactionKinds(getReactionKinds())

    const result = getCurrentReactionIcon()
    if (result) {
      setCurrentReactionIcon(result)
    }
  }, [reactions])

  // ----------------------------------------------------------------------- Animation Effect
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
    <div className="flex items-center gap-3">
      {/* show all kinds of reactions that users have given to this Pin */}
      {reactions.length > 0 && (
        <div className="flex gap-0.5 items-center">
          {reactionIcons.map((item) =>
            reactionKinds.includes(item.id) ? (
              <div
                key={item.id}
                style={{ backgroundImage: `url(${item.src})` }}
                className="h-5 w-5 bg-no-repeat bg-cover"></div>
            ) : null
          )}
          <span className="ml-0.5"> {reactions.length}</span>
        </div>
      )}

      <div ref={containerRef} className="relative">
        <ToolTip text="React">
          <div
            style={{ backgroundColor: currentReactionIcon?.bgColor }}
            onClick={() => {
              if (!currentReactionIcon) {
                handleAddReaction("love")
              }
            }}
            className={`flex justify-center items-center h-11 w-11 rounded-full cursor-pointer bg-gray-bg-4`}>
            {/* If current user has given a reaction to this Pin, show that reaction icon here */}
            {currentReactionIcon ? (
              <div
                style={{ backgroundImage: `url(${currentReactionIcon.src})` }}
                className="h-7 w-7 bg-no-repeat bg-cover"
                onClick={handleRemoveReaction}></div>
            ) : (
              <HiOutlineHeart className="w-7 h-7" />
            )}
          </div>
        </ToolTip>

        {/* 
          There should be a small gap between the heart icon and the reaction list box.
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
                  <div className="h-10 w-10 reaction-container" onClick={() => handleAddReaction(item.id)}>
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
    </div>
  )
}
