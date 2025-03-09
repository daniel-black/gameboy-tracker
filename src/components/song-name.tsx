import { useAppSelector } from "../store/hooks";
import { selectSongName } from "../store/slices/song-slice";

export function SongName() {
  const songName = useAppSelector(selectSongName);

  return (
    <div>
      <p>Song name: {songName ?? "'no name yet'"}</p>
    </div>
  );
}
