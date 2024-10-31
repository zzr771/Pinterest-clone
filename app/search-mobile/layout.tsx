import { Suspense } from "react"
import SearchBarMobile from "./_components/SearchBarMobile"
import Loading from "../settings/loading"

export default async function SearchMobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loading />}>
      <main>
        <SearchBarMobile />
        {children}
      </main>
    </Suspense>
  )
}
