import { configureStore } from "@reduxjs/toolkit";
import songReducer from "./slices/song-slice";
import { songMiddleware } from "./middleware/song-middleware";

export const store = configureStore({
  reducer: {
    song: songReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(songMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
