import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectIsPlaying,
  startPlayback,
  stopPlayback,
} from "../store/slices/song-slice";

export function Play() {
  const dispatch = useAppDispatch();
  const isPlaying = useAppSelector(selectIsPlaying);

  function handleOnClick() {
    dispatch((isPlaying ? stopPlayback : startPlayback)());
  }

  return <button onClick={handleOnClick}>{isPlaying ? "Stop" : "Play"}</button>;
}
