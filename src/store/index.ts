import { configureStore } from "@reduxjs/toolkit";
import songReducer from "./slices/song-slice";

export const store = configureStore({
  reducer: {
    song: songReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
