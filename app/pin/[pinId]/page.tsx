import BackwardButton from "@/components/shared/BackwardButton"
import PinImage from "./components/PinImage"
import Comments from "./components/Comments"
import WaterFall from "@/components/layout/WaterFall"

export default async function Page({ params }: { params: { userId: string } }) {
  return (
    <div className="relative w1:mt-[90px]">
      <div className="fixed w1:top-24 w1:left-4 left-2 top-2 z-[1]">
        <BackwardButton />
      </div>

      <section className="flex pin-container-width min-h-[592px] max-h-[902px] w1:mt-2.5 mx-auto rounded-[2rem] shadow-medium">
        <div className="pin-image-width min-h-[592px] overflow-hidden w1:max-w5:rounded-t-[2rem] w5:rounded-l-[2rem]">
          <PinImage src={"/assets/test/PinDetail/pin-detail5.jpg"} />
        </div>
        <div className="pin-image-width rounded-r-[2rem] min-h-[592px]">
          <Comments />
        </div>
      </section>

      <div className="mt-4">
        <h4 className="p-3 mb-1 text-center font-medium text-xl">More to explore</h4>
        <WaterFall />
      </div>
    </div>
  )
}
