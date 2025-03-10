import { Middleware } from "@reduxjs/toolkit";
import { startPlayback } from "../slices/song-slice";
import { tracker } from "../../audio/tracker";

export const songMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.type === startPlayback.type) {
    const song = store.getState().song;
    tracker.playPattern({
      beatsPerMinute: song.beatsPerMinute,
      pattern: song.patterns[song.currentPatternIndex],
    });
  }

  return next(action);
};
