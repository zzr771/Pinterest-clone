import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserSetting } from "@/lib/types"

type UserState = UserSetting | null
type ArrayOfString = Array<string | undefined> | null
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null as UserState, // 'null' means the user hasn't signed in
    saved: null as ArrayOfString,
    following: null as ArrayOfString,
    follower: null as ArrayOfString,
    likedComments: null as ArrayOfString,
  },
  reducers: {
    setUserInfo(state, action: PayloadAction<UserState>) {
      state.user = action.payload
    },
    setUserSaved(state, action) {
      state.saved = action.payload
    },
    setUserFollowing(state, action) {
      state.following = action.payload
    },
    setUserFollower(state, action) {
      state.follower = action.payload
    },
    setUserLikedComments(state, action) {
      state.likedComments = action.payload
    },
  },
})
export const { setUserInfo, setUserSaved, setUserFollowing, setUserFollower, setUserLikedComments } =
  userSlice.actions
export default userSlice.reducer
