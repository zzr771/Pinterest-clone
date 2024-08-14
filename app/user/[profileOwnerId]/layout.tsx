import { Suspense } from "react"
import UserInfoPart from "./_components/UserInfoPart"
import UserPinsPart from "./_components/UserPinsPart"
import { fetchUserInfo } from "@/lib/actions/user.actions"
import Loading from "@/components/shared/Loading"

export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { profileOwnerId: string }
}) {
  const res = await fetchUserInfo(params.profileOwnerId)
  if ("errorMessage" in res) throw new Error(res.errorMessage)

  return (
    <Suspense fallback={<Loading />}>
      <main className="relative pt-20 text-[15px] max-w3:pt-16">
        <UserInfoPart profileOwner={res} />
        <UserPinsPart profileOwner={res} />
        {children}
      </main>
    </Suspense>
  )
}
