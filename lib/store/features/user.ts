import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserSettings } from "@/lib/types"

type UserState = null | UserSettings
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null as UserState,
  },
  reducers: {
    storeUserInfo(state, action: PayloadAction<UserSettings>) {
      const payload: UserSettings = action.payload
      state.user = action.payload
    },
  },
})
export const { storeUserInfo } = userSlice.actions
export default userSlice.reducer
