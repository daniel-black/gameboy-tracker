import "./app.css";
import { PatternGrid } from "./components/pattern-grid";
import { PlaybackControls } from "./components/playback-controls";

export function App() {
  return (
    <div className="font-mono flex">
      <PatternGrid />
      <PlaybackControls />
    </div>
  );
}
