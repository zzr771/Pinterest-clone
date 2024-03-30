import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "react-slideshow-image/dist/styles.css"
import dynamic from "next/dynamic"
import { ClerkProvider } from "@clerk/nextjs"
const NavBarTop = dynamic(() => import("@/components/layout/NavBarTop"), { ssr: false })
const NavBarBottom = dynamic(() => import("@/components/layout/NavBarBottom"), { ssr: false })
import StoreProvider from "@/components/StoreProvider"
import ScreenReziseMonitor from "@/components/shared/ScreenReziseMonitor"
import Modal from "@/components/shared/Modal"
import SignUpMonitor from "@/components/shared/SignUpMonitor"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: " .",
  description: "",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <StoreProvider>
            <NavBarTop />
            <NavBarBottom />
            <Modal />
            {children}
            <ScreenReziseMonitor />
            <SignUpMonitor />
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
