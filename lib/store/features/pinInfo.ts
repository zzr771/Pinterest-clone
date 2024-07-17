import { createSlice } from "@reduxjs/toolkit"
import { CommentInfo } from "@/lib/types"

type Comments = CommentInfo[] | null
type ArrayState = [] | null
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

    pinReactions: null as ArrayState,
  },
  reducers: {
    setPinBasicInfo(state, action) {
      state.pinBasicInfo = action.payload
    },

    setPinReactions(state, action) {
      state.pinReactions = action.payload
    },
  },
})
export const { setPinBasicInfo, setPinReactions } = pinInfoSlice.actions
export default pinInfoSlice.reducer
