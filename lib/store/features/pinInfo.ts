import { createSlice } from "@reduxjs/toolkit"

const pinInfoSlice = createSlice({
  name: "pinInfo",
  initialState: {
    pinInfo: {
      _id: "",
      imageUrl: "",
      title: "",
      link: "",
      description: "",
      imageSize: {
        width: 0,
        height: 0,
      },
      createdAt: 0,
      author: null,
      comments: null,
      reactions: null,
    },
  },
  reducers: {
    setPinInfo(state, action) {
      state.pinInfo = action.payload
    },
  },
})
export const { setPinInfo } = pinInfoSlice.actions
export default pinInfoSlice.reducer
