import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "react-slideshow-image/dist/styles.css"
import dynamic from "next/dynamic"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "react-hot-toast"
const NavBarTop = dynamic(() => import("@/components/layout/NavBarTop"), { ssr: false })
const NavBarBottom = dynamic(() => import("@/components/layout/NavBarBottom"), { ssr: false })
import StoreProvider from "@/components/StoreProvider"
import ScreenReziseMonitor from "@/components/shared/ScreenReziseMonitor"
import Modal from "@/components/shared/Modal"
import SignInMonitor from "@/components/shared/SignInMonitor"

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
          </StoreProvider>

          <SignInMonitor />
          <Toaster position="top-right" containerClassName="toaster-container" />
        </body>
      </html>
    </ClerkProvider>
  )
}
