import { Option } from "@/lib/types"
import { useState } from "react"
import { IoMdClose } from "react-icons/io"
import { createPortal } from "react-dom"

interface Props {
  options: Option[]
  children: React.ReactNode // The button that toggles the dropdown list.
}
export default function OptionListMobile({ options, children }: Props) {
  if (window.innerWidth >= 820) return null

  const [showList, setShowList] = useState(false)

  function handleClickModal(event: React.MouseEvent<HTMLDivElement>) {
    if (event.currentTarget === event.target) {
      setShowList(false)
    }
  }
  return (
    <>
      {/* The button that toggles the dropdown list. */}
      <div
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation()
          event.nativeEvent.stopImmediatePropagation()
          setShowList(true)
        }}>
        {children}
      </div>

      {showList &&
        createPortal(
          <div className="fixed inset-0 bg-gray-tp-2 z-[110] text-black" onClick={handleClickModal}>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem]">
              {/* close button */}
              <div className="p-2">
                <div
                  className="w-12 h-12 flex justify-center items-center"
                  onClick={() => setShowList(false)}>
                  <IoMdClose className="w-6 h-6" />
                </div>
              </div>

              {/* list */}
              <div className="p-3 text-base">
                {options.map((item) => (
                  <div
                    key={item.label}
                    onClick={() => {
                      item?.callback && item?.callback()
                      setShowList(false)
                    }}
                    className="py-2 font-medium">
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
