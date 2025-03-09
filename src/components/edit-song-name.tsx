import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectSongName, setSongName } from "../store/slices/song-slice";

export function EditSongName() {
  const songName = useAppSelector(selectSongName);
  const dispatch = useAppDispatch();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setSongName(e.target.value));
  }

  return (
    <div>
      <p>edit song name</p>
      <input type="text" value={songName} onChange={handleChange} />
    </div>
  );
}
