"use client"
import dynamic from "next/dynamic"
import Image from "next/image"
import { FaPinterest } from "react-icons/fa"
import { abbreviateNumber } from "@/lib/utils"
import Paragraph from "@/components/shared/Paragraph"
import Buttons from "./components/Buttons"
import Tabs from "@/components/shared/Tabs"
import { useState } from "react"
import WaterFall from "@/components/layout/WaterFall"
const FollowList = dynamic(() => import("./components/FollowList"))

const tabs = ["Created", "Saved"]
export default function Page({ params }: { params: { userId: string } }) {
  const [selectedTab, setSelectedTab] = useState(tabs[0])

  const [showFollowList, setShowFollowList] = useState(false)
  const [followType, setFollowType] = useState<"followers" | "following">("followers")

  const userWebsite = ""
  const followerNum = abbreviateNumber(6332)
  const followingNum = 15

  return (
    <section className="mt-20 text-[15px]">
      <div className="flex flex-col items-center w-[488px] mx-auto mb-8">
        {/* avatar */}
        <Image
          className="rounded-full bg-gray-bg-1 mb-1 object-cover"
          src={"/assets/test/avatar3.jpg"}
          alt="user avatar"
          width={120}
          height={120}
        />
        {/* user full name */}
        <h2 className="mt-1  font-medium text-[2.2rem]">
          {"AI"} {"ART"}
        </h2>
        {/* username */}
        <div className="flex items-center mb-2 gap-1 text-gray-font-4">
          <FaPinterest />
          <span className="text-sm font-light">{"rhiakai86"}</span>
        </div>
        {/* website & about */}
        <Paragraph maxLines={3} className="text-center">
          <span>
            <span className="font-medium cursor-pointer hover:underline">{userWebsite}</span>
            {userWebsite && " · "}
            <span className="font-light">{"Photos and Images are made of ARTIFICIAL INTELLIGENCE"}</span>
          </span>
        </Paragraph>
        {/* follower & following */}
        <div className="my-2 font-medium">
          <span
            className="cursor-pointer"
            onClick={() => {
              setFollowType("followers")
              setShowFollowList(true)
            }}>
            {followerNum && (
              <span>
                {followerNum && `${followerNum} ${followerNum === "1" ? "follower" : "followers"} · `}{" "}
              </span>
            )}
          </span>
          <span
            className="cursor-pointer"
            onClick={() => {
              setFollowType("following")
              setShowFollowList(true)
            }}>
            {14} following
          </span>
        </div>

        <Buttons />
      </div>

      {showFollowList && <FollowList type={followType} number={1153} setShowFollowList={setShowFollowList} />}

      <div className="py-3">
        <Tabs tabs={tabs} setSelectedTab={setSelectedTab} />
      </div>

      <WaterFall />
    </section>
  )
}
