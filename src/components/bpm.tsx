import { useAppSelector } from "../store/hooks";
import { selectBeatsPerMinute } from "../store/slices/song-slice";

export function Bpm() {
  const bpm = useAppSelector(selectBeatsPerMinute);

  return (
    <div>
      <p>BPM: {bpm}</p>
    </div>
  );
}
