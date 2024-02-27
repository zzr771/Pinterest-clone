"use client"
import { useState } from "react"
import PinDraftList from "./components/PinDraftList"
import type { Draft } from "@/lib/types"

export default async function Page() {
  const [editingDraft, setEditingDraft] = useState<Draft>({ image: "" })

  function onDraftSelect(selectedDraft: Draft) {
    setEditingDraft(selectedDraft)
  }

  return (
    <div className="flex mt-20 main-content">
      <PinDraftList onDraftSelect={onDraftSelect} />
    </div>
  )
}
