import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import dynamic from "next/dynamic"
const NavBarTop = dynamic(() => import("@/components/layout/NavBarTop"), { ssr: false })
const NavBarBottom = dynamic(() => import("@/components/layout/NavBarBottom"), { ssr: false })
import StoreProvider from "@/components/StoreProvider"
import ScreenReziseMonitor from "@/components/shared/ScreenReziseMonitor"
import Modal from "@/components/shared/Modal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: " .",
  description: "",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <ScreenReziseMonitor />
          <NavBarTop />
          <NavBarBottom />
          <Modal />
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
