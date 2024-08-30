"use client"
import { PinInfoBasic } from "@/lib/types"
import dynamic from "next/dynamic"
const EditPinForm = dynamic(() => import("./EditPinForm"), { ssr: false })

interface Props {
  pinInfoBasic: PinInfoBasic
  setPinBasicInfo: React.Dispatch<React.SetStateAction<PinInfoBasic>>
  showEditPinForm: boolean
  setShowEditPinForm: React.Dispatch<React.SetStateAction<boolean>>
}
export default function EditPinContainer({
  pinInfoBasic,
  setPinBasicInfo,
  showEditPinForm,
  setShowEditPinForm,
}: Props) {
  return (
    <div
      className={`fixed inset-0 z-[120] w3:z-[110]  w3:transition-300 ${
        showEditPinForm ? "bg-gray-tp-3" : "invisible"
      }`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          setShowEditPinForm(false)
        }
      }}>
      <div
        className={`absolute right-0 h-screen w-screen w3:w-[540px] bg-white w3:transition-300 ${
          showEditPinForm ? "translate-x-0" : "translate-x-full"
        }`}>
        {showEditPinForm && (
          <EditPinForm
            pinInfoBasic={pinInfoBasic}
            setShowEditPinForm={setShowEditPinForm}
            setPinBasicInfo={setPinBasicInfo}
          />
        )}
      </div>
    </div>
  )
}
