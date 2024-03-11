import { createSlice } from "@reduxjs/toolkit"

const screenSizeSlice = createSlice({
  name: "screenSize",
  initialState: {
    screenSize: 1920,
  },
  reducers: {
    setScreenSize(state, action) {
      state.screenSize = action.payload
    },
  },
})
export const { setScreenSize } = screenSizeSlice.actions
export default screenSizeSlice.reducer
