import { MdOutlineFileUpload } from "react-icons/md"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "@/components/shared/Button"

export default function Comments() {
  return (
    <div className="h-full pl-[18px] flex flex-col">
      <div className="flex-1">
        {/* top bar */}
        <div className="flex justify-between h-[3.75rem] pt-8 pr-8 box-content rounded-tr-[2rem] sticky top-[64px] z-2 ">
          <div className="flex items-center">
            <Button rounded hover clickEffect>
              <MdOutlineFileUpload className="w-7 h-7" />
            </Button>
            <Button rounded hover clickEffect>
              <TfiMoreAlt className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center">
            <Button text="Save" bgColor="red" hover />
          </div>
        </div>

        {/* comments */}
      </div>

      {/* input */}
      <div className="border-top h-[144px] sticky bottom-0 z-1 py-2 px-8">
        <div className="flex justify-between items-center mt-1 mb-3">
          <span className="font-semibold text-xl">What do you think?</span>
          <div className="flex items-center gap-3">
            <div className="reaction"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
