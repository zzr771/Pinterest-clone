"use client"

import Tabs from "@/components/shared/Tabs"
import { UserInfo } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const tabs = ["created", "saved"]
interface Props {
  profileOwner: UserInfo
}
export default function UserPinsPart({ profileOwner }: Props) {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("created")
  useEffect(() => {
    router.replace(`/user/${profileOwner._id}/${selectedTab}`, { scroll: false })
  }, [selectedTab])

  return (
    <>
      <div className="py-3">
        <Tabs tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
    </>
  )
}
