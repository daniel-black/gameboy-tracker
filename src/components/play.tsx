import { useAppDispatch } from "../store/hooks";
import { startPlayback } from "../store/slices/song-slice";

export function Play() {
  const dispatch = useAppDispatch();

  function handleOnClick() {
    dispatch(startPlayback());
  }

  return <button onClick={handleOnClick}>Play</button>;
}
