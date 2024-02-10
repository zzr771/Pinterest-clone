/*
  Which navBar to load depends on the screen size which cannot be known on server side.
  To prevent the DOM difference between the server and client sides, use dynamic import.
*/
import dynamic from "next/dynamic"
const NavBarTop = dynamic(() => import("@/components/ui/NavBarTop"), { ssr: false })
const NavBarBottom = dynamic(() => import("@/components/ui/NavBarBottom"), { ssr: false })

import ScreenReziseMonitor from "@/components/shared/ScreenReziseMonitor"
import WaterFall from "@/components/ui/WaterFall"
import Modal from "@/components/shared/Modal"

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScreenReziseMonitor />
      <NavBarTop />
      <NavBarBottom />
      <section className="relative w3:mt-20">
        <WaterFall />
        <Modal />
      </section>
    </main>
  )
}
