import { Option } from "@/lib/types"
import { IoMdClose } from "react-icons/io"

interface Props {
  setShowList: React.Dispatch<React.SetStateAction<boolean>>
  options: Option[]
}
export default function OptionListMobile({ setShowList, options }: Props) {
  function handleClickModal(event: React.MouseEvent<HTMLDivElement>) {
    if (event.currentTarget === event.target) {
      setShowList(false)
    }
  }
  return (
    <div className="fixed inset-0 bg-gray-tp-2 z-[20] text-black" onClick={handleClickModal}>
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem]">
        {/* close button */}
        <div className="p-2">
          <div className="w-12 h-12 flex justify-center items-center" onClick={() => setShowList(false)}>
            <IoMdClose className="w-6 h-6" />
          </div>
        </div>

        {/* list */}
        <div className="p-3 text-base">
          {options.map((item) => (
            <div key={item.label} onClick={item?.callback} className="py-2 font-medium">
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
