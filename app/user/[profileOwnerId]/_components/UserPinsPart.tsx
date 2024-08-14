"use client"

import Tabs from "@/components/shared/Tabs"
import { UserInfo } from "@/lib/types"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

/*
    With current folder and file structure, when users enter '/user/xxx',
  'created' as a subroute will be automatically appended to the url.
*/
const tabs = ["created", "saved"]
interface Props {
  profileOwner: UserInfo
}
export default function UserPinsPart({ profileOwner }: Props) {
  const subRouteName = usePathname().split("/").pop() || "created"
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(subRouteName)
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
