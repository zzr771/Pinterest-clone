import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import StoreProvider from "@/components/StoreProvider"
import NavBarTop from "@/components/ui/NavBarTop"
import NavBarBottom from "@/components/ui/NavBarBottom"
import ScreenReziseMonitor from "@/components/shared/ScreenReziseMonitor"
import Modal from "@/components/shared/Modal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Developing",
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
