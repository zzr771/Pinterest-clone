import BackwardButton from "@/components/shared/BackwardButton"
import PinImage from "./components/PinImage"
import Comments from "./components/Comments"

export default async function Page({ params }: { params: { userId: string } }) {
  return (
    <div className="relative mt-[90px]">
      <div className="fixed top-24 left-4 z-[1]">
        <BackwardButton />
      </div>

      <section className="flex items-stretch mt-2.5 mx-auto rounded-[2rem] shadow-large w-[1016px] min-h-[592px] max-h-[902px]">
        <div className="w-[508px] rounded-l-[2rem] min-h-[592px] overflow-hidden">
          <PinImage src={"/assets/test/PinDetail/pin-detail2.jpg"} />
        </div>
        <div className="w-[508px] rounded-r-[2rem] min-h-[592px]">
          <Comments />
        </div>
      </section>

      <div className="w-20 h-[2000px] mt-10 mx-aut"></div>
    </div>
  )
}
