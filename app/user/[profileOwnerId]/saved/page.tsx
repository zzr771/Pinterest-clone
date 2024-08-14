import WaterFall from "@/components/layout/WaterFall"

export default function Page({ params }: { params: { profileOwnerId: string } }) {
  return (
    <div className="min-h-[50vh]">
      <WaterFall requestName={"FETCH_USER_SAVED_PINS"} param={{ userId: params.profileOwnerId }} />
    </div>
  )
}
