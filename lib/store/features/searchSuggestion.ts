import { createSlice } from "@reduxjs/toolkit"

const searchSuggestion = createSlice({
  name: "searchSuggestion",
  initialState: {
    showSearchSuggestion: false,
  },
  reducers: {
    setShowSearchSuggestion(state, action) {
      state.showSearchSuggestion = action.payload
    },
  },
})
export const { setShowSearchSuggestion } = searchSuggestion.actions
export default searchSuggestion.reducer
