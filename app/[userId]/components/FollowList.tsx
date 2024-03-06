// List of followers and followings

import { IoMdClose } from "react-icons/io"
import Button from "@/components/shared/Button"
import { separateNumberByComma } from "@/lib/utils"
import Image from "next/image"

interface Props {
  type: "followers" | "following"
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

export default function FollowList({ type, number, setShowFollowList }: Props) {
  const numberString = separateNumberByComma(number)

  function handleClick(event: React.MouseEvent) {
    if (event.target === event.currentTarget) {
      setShowFollowList(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-tp-1 z-[200]"
      onClick={handleClick}>
      <div className="flex flex-col w-[550px] h-[833px] rounded-2xl bg-white pb-2">
        {/* title */}
        <div className="relative flex justify-center items-center m-6 p-6">
          <span className="capitalize font-medium text-[26px]">
            {numberString} {type}
          </span>
          <Button
            hover
            clickEffect
            rounded
            className="absolute right-3"
            click={() => setShowFollowList(false)}>
            <IoMdClose className="w-7 h-7 text-gray-font-4" />
          </Button>
        </div>

        {/* list */}
        <div className="flex-1 py-2 px-6 overflow-y-auto">
          {list.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-1">
              <div className="flex items-center gap-2">
                <Image
                  src={item.image}
                  alt="user avatar"
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
                <span className="font-medium">{item.username}</span>
              </div>
              <Button
                size="small"
                className="h-[38px] !text-base !font-medium"
                text={item.isFollowing ? "Unfollow" : "Follow"}
                bgColor={item.isFollowing ? "gray" : "red"}
                hover
                clickEffect></Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
