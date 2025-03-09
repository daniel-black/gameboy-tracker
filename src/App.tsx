import { Bpm } from "./components/bpm";
import { EditBpm } from "./components/edit-bpm";
import { EditSongName } from "./components/edit-song-name";
import { Pattern } from "./components/pattern";
import { SongName } from "./components/song-name";

export function App() {
  return (
    <div>
      <p>this is the app</p>
      <SongName />
      <EditSongName />
      <hr />
      <Bpm />
      <EditBpm />
      <hr />
      <Pattern patternIndex={0} />
    </div>
  );
}
