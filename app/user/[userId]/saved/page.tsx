import WaterFall from "@/components/layout/WaterFall"

export default function Page({ params }: { params: { userId: string } }) {
  return (
    <div className="min-h-[600px]">
      <WaterFall requestName={"FETCH_USER_SAVED_PINS"} param={{ userId: params.userId }} />
    </div>
  )
}
