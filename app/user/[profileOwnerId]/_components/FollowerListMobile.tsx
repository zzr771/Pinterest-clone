// List of followers and followings for mobile devices

import { FaAngleLeft } from "react-icons/fa6"
import Button from "@/components/shared/Button"
import { separateNumberByComma } from "@/lib/utils"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/store/hook"
import { useEffect, useState } from "react"
import { UserList } from "@/lib/types"
import { fetchUserFollowList } from "@/lib/actions/user.actions"
import toast from "react-hot-toast"
import useFollowUser from "@/lib/hooks/useFollowUser"

interface Props {
  userId: string
  type: "follower" | "following"
  number: number
  setShowFollowList: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FollowerListMobile({ userId, type, number, setShowFollowList }: Props) {
  const router = useRouter()
  const user = useAppSelector((state) => state.user.user)
  const following = useAppSelector((state) => state.user.following)
  const numberString = separateNumberByComma(number)
  const [users, setUsers] = useState<UserList>([])

  useEffect(() => {
    async function getUsers() {
      const res = await fetchUserFollowList(userId, type)
      if ("errorMessage" in res) {
        toast.error(res.errorMessage)
        return
      }
      setUsers(res)
    }
    getUsers()
  }, [type, userId])

  const { followUser, unfollowUser } = useFollowUser({ followHandler: () => {}, unfollowHandler: () => {} })

  return (
    <div className="fixed inset-0 flex flex-col bg-white z-[90]">
      {/* title */}
      <div className="flex justify-between items-center h-[3.75rem] py-3 px-2 shadow-small">
        <Button rounded className="!h-10 w-10" click={() => setShowFollowList(false)}>
          <FaAngleLeft className="w-5 h-5 text-black" />
        </Button>
        <span className="font-medium text-base">
          {numberString} {type}
          {type === "follower" && number > 1 && "s"}
        </span>
        <div className="h-10 w-10"></div>
      </div>

      {/* list */}
      <div className="flex-1 pt-2 pb-14 px-4 overflow-y-auto">
        {users.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <svg
              aria-label="Loading Search Results"
              className="loading-spinner"
              height="40"
              role="img"
              viewBox="0 0 24 24"
              width="40">
              <path d="M15 10.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m-6-6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24"></path>
            </svg>
          </div>
        )}
        {users.map((item) => (
          <div key={item._id} className="flex justify-between items-center h-[75px]">
            <div
              className="flex items-center gap-2"
              onClick={() => {
                router.push(`/user/${item._id}`)
              }}>
              <Image
                src={item.imageUrl}
                alt="user avatar"
                width={32}
                height={32}
                className="rounded-full object-cover mx-2"
              />
              <span className="text-sm">
                {item.firstName} {item.lastName}
              </span>
            </div>

            {user?._id === item._id ? (
              <Button
                size="small"
                className="h-[38px] !text-base !font-medium text-gray-font-4"
                text={"That's you!"}
                bgColor={"gray"}></Button>
            ) : (
              <Button
                size="small"
                className="h-[38px] !text-base !font-medium"
                text={following?.includes(item._id) ? "Unfollow" : "Follow"}
                bgColor={following?.includes(item._id) ? "black" : "red"}
                click={() => {
                  if (following?.includes(item._id)) {
                    unfollowUser(item._id)
                  } else {
                    followUser(item._id)
                  }
                }}
                hover
                clickEffect></Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
