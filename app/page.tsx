import WaterFall from "@/components/layout/WaterFall"

export default function Home() {
  return (
    <main>
      <section className="relative w3:mt-20">
        <WaterFall requestName={"FETCH_PINS"} />
      </section>
    </main>
  )
}
