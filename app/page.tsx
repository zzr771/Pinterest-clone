import WaterFall from "@/components/layout/WaterFall"

export default function Home() {
  return (
    <main className="w3:mt-20">
      <WaterFall requestName={"FETCH_PINS"} />
    </main>
  )
}
