"use client"
import { useState } from "react"
import PinDraftList from "./components/PinDraftList"
import type { Draft } from "@/lib/types"
import PinForm from "./components/PinForm"

const date1 = new Date().getTime() + 30 * 24 * 60 * 60 * 1000
const date2 = new Date().getTime() + 27 * 24 * 60 * 60 * 1000
const draftList = [
  { _id: "e64f", title: "Draft 1", image: "/assets/test/PinCard/1.jpg", expirationTime: date1 },
  { _id: "8b7g", image: "/assets/test/PinCard/2.jpg", expirationTime: date2 },
  { _id: "fe7g", image: "/assets/test/PinCard/3.jpg", expirationTime: date2 },
  { _id: "gdrh", image: "/assets/test/PinCard/3.jpg", expirationTime: date2 },
  { _id: "yjytgk", image: "/assets/test/PinCard/3.jpg", expirationTime: date2 },
  { _id: "ljil", image: "/assets/test/PinCard/3.jpg", expirationTime: date2 },
  { _id: "ytjt", image: "/assets/test/PinCard/3.jpg", expirationTime: date2 },
]
export default function Page() {
  const [editingDraft, setEditingDraft] = useState<Draft>({ image: "", expirationTime: date1 })

  return (
    <div className="flex mt-20 main-content">
      <PinDraftList draftList={draftList} editingDraft={editingDraft} setEditingDraft={setEditingDraft} />
      <PinForm />
    </div>
  )
}
