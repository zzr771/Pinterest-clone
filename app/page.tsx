import Button from "@/components/ui/Button"
import Image from "next/image"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button>
        <Image src="/assets/search.svg" alt="search" width={24} height={24} />
      </Button>
    </main>
  )
}
