import WaterFall from "@/components/layout/WaterFall"

export default function Page({ params }: { params: { profileOwnerId: string } }) {
  return (
    /*
        When switching between '/user/[xxx]/created' and '/user/[xxx]/saved', there is a
      short moment when <Waterfall /> is not mounted. Without <Waterfall />, the height of the  
      page is not enough to generate a scrollbar.
        But after this moment, <Waterfall /> is mounted and increases the page's height, and a 
      scrollbar appears. When it appears, it takes some space and pushes some content  to the
      left, whick looks like the page 'shakes'.
        To prevent this, set the min-height to 50vh to make the page's height always enough to
      generate a scrollbar.
    */
    <div className="min-h-[50vh]">
      <WaterFall requestName={"FETCH_USER_CREATED_PINS"} param={{ userId: params.profileOwnerId }} />
    </div>
  )
}
