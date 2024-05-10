import { createSlice } from "@reduxjs/toolkit"

const pinInfoSlice = createSlice({
  name: "pinInfo",
  initialState: {
    pinBasicInfo: {
      _id: "",
      imageUrl: "",
      title: "",
      link: "",
      description: "",
      author: null,
    },
    pinComments: null,
    pinReactions: null,
  },
  reducers: {
    setPinBasicInfo(state, action) {
      state.pinBasicInfo = action.payload
    },
    setPinComments(state, action) {
      state.pinComments = action.payload
    },
    setPinReactions(state, action) {
      state.pinReactions = action.payload
    },
  },
})
export const { setPinBasicInfo, setPinComments, setPinReactions } = pinInfoSlice.actions
export default pinInfoSlice.reducer
