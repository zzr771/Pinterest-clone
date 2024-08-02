import UserInfoPart from "./_components/UserInfoPart"
import UserPinsPart from "./_components/UserPinsPart"
import { fetchUserInfo } from "@/lib/actions/user.actions"

export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { userId: string }
}) {
  const res = await fetchUserInfo(params.userId)
  if ("errorMessage" in res) throw new Error(res.errorMessage)

  return (
    <section className="relative pt-20 text-[15px] max-w3:pt-16">
      <UserInfoPart profileOwner={res} />
      <UserPinsPart profileOwner={res} />
      {children}
    </section>
  )
}
