import WaterFall from "@/components/layout/WaterFall"

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="relative w3:mt-20">
        <WaterFall requestName={"FETCH_PINS"} />
      </section>
    </main>
  )
}
