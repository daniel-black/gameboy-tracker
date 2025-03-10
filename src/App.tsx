import "./app.css";
import { Bpm } from "./components/bpm";
import { EditBpm } from "./components/edit-bpm";
import { EditSongName } from "./components/edit-song-name";
import { Pattern } from "./components/pattern";
import { SongName } from "./components/song-name";
import { Patterns } from "./components/patterns";
import { Play } from "./components/play";

export function App() {
  return (
    <div className="font-mono">
      <p>this is the app</p>
      <SongName />
      <EditSongName />
      <hr />
      <Bpm />
      <EditBpm />
      <hr />
      <Patterns />
      <hr />
      <Play />
      <Pattern />
    </div>
  );
}
