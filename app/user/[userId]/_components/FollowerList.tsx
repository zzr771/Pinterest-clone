// List of followers and followings

import { IoMdClose } from "react-icons/io"
import Button from "@/components/shared/Button"
import { separateNumberByComma } from "@/lib/utils"
import Image from "next/image"
import { useAppSelector } from "@/lib/store/hook"
import { useEffect, useState } from "react"
import { UserList } from "@/lib/types"
import { fetchUserFollowList } from "@/lib/actions/user.actions"
import toast from "react-hot-toast"
import useFollowUser from "@/lib/hooks/useFollowUser"
import { useRouter } from "next/navigation"

interface Props {
  userId: string
  type: "follower" | "following"
  number: number
  setShowFollowList: React.Dispatch<React.SetStateAction<boolean>>
}
export default function FollowerList({ userId, type, number, setShowFollowList }: Props) {
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
  }, [])

  const { followUser, unfollowUser } = useFollowUser({ followHandler: () => {}, unfollowHandler: () => {} })

  function handleClickModal(event: React.MouseEvent) {
    if (event.target === event.currentTarget) {
      setShowFollowList(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-tp-1 z-[110]"
      onClick={handleClickModal}>
      <div className="flex flex-col w-[550px] max-h-[90%] rounded-2xl bg-white pb-2">
        {/* title */}
        <div className="relative flex justify-center items-center m-6 p-6">
          <span className="capitalize font-medium text-[26px]">
            {numberString} {type}
            {type === "follower" && number > 1 && "s"}
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
          {users.length === 0 && (
            <div className="flex justify-center items-center mb-10">
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
          {users.length > 0 &&
            users.map((item) => (
              <div key={item._id} className="flex justify-between items-center py-1">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    router.push(`/user/${item._id}`)
                  }}>
                  <Image
                    src={item.imageUrl}
                    alt="user avatar"
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                  <span className="font-medium">
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
    </div>
  )
}
