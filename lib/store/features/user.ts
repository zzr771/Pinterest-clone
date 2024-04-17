import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserSettings } from "@/lib/types"

type UserState = null | UserSettings
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null as UserState, // 'null' means the user hasn't signed in
  },
  reducers: {
    storeUserInfo(state, action: PayloadAction<UserState>) {
      const payload: UserState = action.payload
      state.user = payload
    },
  },
})
export const { storeUserInfo } = userSlice.actions
export default userSlice.reducer
