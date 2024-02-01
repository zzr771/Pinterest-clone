"use client"

/*
  Dynamically import NavBars to prevent 'Warning: Expected server HTML to contain a matching <div> in <div>.'

  On the server side, the server doesn't know the screen size, thus doesn't know which nav bar is shown
  (NavBarBottom or NavBarTop). This causes a DOM tree difference between client and server sides, which
  will give the above warning.
*/
import dynamic from "next/dynamic"
const NavBarBottom = dynamic(() => import("@/components/ui/NavBarBottom"), { ssr: false })
const NavBarTop = dynamic(() => import("@/components/ui/NavBarTop"), { ssr: false })
const PinCard = dynamic(() => import("@/components/cards/PinCard"), { ssr: false })
import useScreenResize from "@/lib/useScreenResize"

export default function Home() {
  useScreenResize()

  return (
    <main className="min-h-screen">
      <NavBarBottom />
      <NavBarTop />
      <PinCard
        pinId="2"
        image="/assets/test/PinCard/3.jpg"
        imageSize={{
          width: 236,
          height: 464,
        }}
        title="Witness the most amazing scenaries in Alps"
        author={{
          name: "Dodi's Personalized Trip Schedule",
          avatar: "/assets/test/avatar.jpg",
        }}
      />
    </main>
  )
}
