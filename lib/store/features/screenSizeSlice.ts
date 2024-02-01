import { createSlice } from "@reduxjs/toolkit"

const screenSizeSlice = createSlice({
  name: "resize",
  initialState: {
    screenSize: 820,
  },
  reducers: {
    setScreenSize(state, action) {
      state.screenSize = action.payload
    },
  },
})
export const { setScreenSize } = screenSizeSlice.actions
export default screenSizeSlice.reducer
