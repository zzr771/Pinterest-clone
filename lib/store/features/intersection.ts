import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Payload {
  name: "OptionButtonMobile" | "NavBarBottom"
  /*
      The callback of IntersectionObserver will be triggered whenever the 'observe' method is called.
    When the page is initially rendered, we don't want to trigger that callback because that will change
    the 'event' value, components listening to the 'event' value are likely to be affected.
      So 'initial' is a flag for the first triggering (page rendered), then it will be set to 'ready'.
    And the next time 'setIntersectionState' is called, 'ready' won't block the normal logic.
  */
  event: "enter-bottom" | "leave-bottom" | "enter-top" | "leave-top" | "initial" | "ready"
}
const intersectionSlice = createSlice({
  name: "intersection",
  initialState: {
    observers: {
      OptionButtonMobile: "initial",
      NavBarBottom: "initial",
    },
  },
  reducers: {
    setIntersectionState(state, action: PayloadAction<Payload>) {
      const payload: Payload = action.payload

      /*
          Handle an exception: the pin image is too tall that there are no other elements on
         the initial rendered page. 
      */
      if (state.observers[payload.name] === "initial" && payload.event === "leave-bottom") {
        state.observers[payload.name] = "leave-bottom"
        return
      }

      if (state.observers[payload.name] === "initial") {
        state.observers[payload.name] = "ready"
        return
      }
      state.observers = { ...state.observers, [payload.name]: payload.event }
    },
  },
})
export const { setIntersectionState } = intersectionSlice.actions
export default intersectionSlice.reducer
