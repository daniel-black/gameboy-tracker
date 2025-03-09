import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectBeatsPerMinute,
  setBeatsPerMinute,
} from "../store/slices/song-slice";

export function EditBpm() {
  const bpm = useAppSelector(selectBeatsPerMinute);
  const dispatch = useAppDispatch();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newBpm = parseInt(e.target.value, 10);
    dispatch(setBeatsPerMinute(newBpm));
  }

  return (
    <div>
      <p>edit bpm</p>
      <input
        type="number"
        value={bpm}
        onChange={handleChange}
        min={40}
        max={260}
      />
    </div>
  );
}
