"use client"
import { setShowEditPinForm } from "@/lib/store/features/modal"
import { useAppDispatch, useAppSelector } from "@/lib/store/hook"
import { PinInfoBasic } from "@/lib/types"
import dynamic from "next/dynamic"
const EditPin = dynamic(() => import("./EditPin"), { ssr: false })

interface Props {
  pin: PinInfoBasic
}
export default function EditPinContainer({ pin }: Props) {
  const dispatch = useAppDispatch()
  const showEditPinForm = useAppSelector((store) => store.modal.showEditPinForm)

  return (
    <div
      className={`fixed inset-0 z-[110] w3:transition-300 ${showEditPinForm ? "bg-gray-tp-3" : "invisible"}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          dispatch(setShowEditPinForm(false))
        }
      }}>
      <div
        className={`absolute right-0 h-screen w-screen w3:w-[540px] bg-white w3:transition-300 ${
          showEditPinForm ? "translate-x-0" : "translate-x-full"
        }`}>
        {showEditPinForm && <EditPin />}
      </div>
    </div>
  )
}
