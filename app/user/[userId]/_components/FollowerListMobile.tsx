// List of followers and followings for mobile devices

import { FaAngleLeft } from "react-icons/fa6"
import Button from "@/components/shared/Button"
import { separateNumberByComma } from "@/lib/utils"
import Image from "next/image"

interface Props {
  type: "follower" | "following"
  number: number
  setShowFollowList: React.Dispatch<React.SetStateAction<boolean>>
}
interface User {
  username: string
  image: string
  isFollowing: boolean
}

const user: User = {
  username: "Dreamstime Stock Photos",
  image: "/assets/test/avatar2.jpg",
  isFollowing: false,
}
const list = new Array(15).fill(user)

export default function FollowerListMobile({ type, number, setShowFollowList }: Props) {
  const numberString = separateNumberByComma(number)

  function handleClick(event: React.MouseEvent) {
    if (event.target === event.currentTarget) {
      setShowFollowList(false)
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-white z-[90]" onClick={handleClick}>
      {/* title */}
      <div className="flex justify-between items-center h-[3.75rem] py-3 px-2 shadow-small">
        <Button rounded className="!h-10 w-10" click={() => setShowFollowList(false)}>
          <FaAngleLeft className="w-5 h-5 text-black" />
        </Button>
        <span className="font-medium text-base">
          {numberString} {type} {type === "follower" && number > 1 && "s"}
        </span>
        <div className="h-10 w-10"></div>
      </div>

      {/* list */}
      <div className="flex-1 pt-2 pb-14 px-4 overflow-y-auto">
        {list.map((item, index) => (
          <div key={index} className="flex justify-between items-center h-[75px]">
            <div className="flex items-center gap-2">
              <Image
                src={item.image}
                alt="user avatar"
                width={32}
                height={32}
                className="rounded-full object-cover mx-2"
              />
              <span className="text-sm">{item.username}</span>
            </div>
            <Button
              size="small"
              className="h-[40px] !text-base !font-medium mx-1"
              text={item.isFollowing ? "Unfollow" : "Follow"}
              bgColor={item.isFollowing ? "gray" : "red"}
              hover
              clickEffect></Button>
          </div>
        ))}
      </div>
    </div>
  )
}
