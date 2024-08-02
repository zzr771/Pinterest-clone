import dynamic from "next/dynamic"
import { getClient } from "@/lib/ApolloClient"
import BackwardButton from "@/components/shared/BackwardButton"
import PinImage from "./_components/PinImage"
import PinContent from "./_components/PinContent"
import WaterFall from "@/components/layout/WaterFall"
const InterSectionMonitor = dynamic(() => import("@/components/mobile/IntersectionMonitor"), { ssr: false })
const OptionButtonMobile = dynamic(() => import("@/components/mobile/OptionButtonMobile"), { ssr: false })
import { FETCH_PIN } from "@/lib/apolloRequests/pin.request"

export default async function Page({ params }: { params: { pinId: string } }) {
  // For unknown reasons, sometimes, params.pinId can be a string: 'installHook.js.map'
  if (!params.pinId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error("Invalid Pin ID")
  }

  const {
    data: { pin },
    error,
  } = await getClient().query({
    query: FETCH_PIN,
    variables: {
      pinId: params.pinId,
    },
  })

  return (
    <main className="relative w3:mt-[90px]">
      <div className="fixed w3:top-24 w3:left-4 left-2 top-2 z-[1]">
        <BackwardButton />
      </div>
      <div className="fixed w3:hidden right-2 top-2 z-[10]">
        <OptionButtonMobile pin={pin} />
      </div>

      <section className="flex pin-container-width w3:mt-2.5 mx-auto rounded-[2rem] w3:shadow-medium w3:items-stretch">
        <PinImage imageUrl={pin.imageUrl} width={pin.imageSize.width} height={pin.imageSize.height} />
        <InterSectionMonitor name="OptionButtonMobile" />
        <PinContent pin={pin} />
      </section>

      <div className="relative w3:mt-4 max-w3:border-t max-w3:border-gray-bg-4">
        <h4 className="w3:p-3 w3:mb-1 w3:text-center w3:text-xl max-w3:mt-4 max-w3:mb-2 max-w3:px-2 font-medium ">
          More to explore
        </h4>
        {/* <WaterFall requestName={"FETCH_PINS"} /> */}
      </div>
    </main>
  )
}
