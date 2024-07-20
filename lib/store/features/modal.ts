import { createSlice } from "@reduxjs/toolkit"

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    showModal: false,
    showEditPinForm: false,
  },
  reducers: {
    setShowModal(state, action) {
      state.showModal = action.payload
    },
  },
})
export const { setShowModal } = modalSlice.actions
export default modalSlice.reducer
