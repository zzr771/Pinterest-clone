import { configureStore } from "@reduxjs/toolkit"
import screenSizeReducer from "./features/screenSize"
import modalReducer from "./features/modal"
import intersectionReducer from "./features/intersection"

export const makeStore = () => {
  return configureStore({
    reducer: {
      screenSize: screenSizeReducer,
      modal: modalReducer,
      intersection: intersectionReducer,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
