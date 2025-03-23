import "./app.css";
import { BPM } from "./components/bpm";
import { Loop } from "./components/loop";
import { MasterVolume } from "./components/master-volume";
import { PatternGrid } from "./components/pattern-grid";
import { Playback } from "./components/playback";

export function App() {
  return (
    <div className="font-mono flex">
      <div className="m-10">
        <PatternGrid />
      </div>
      <div className="m-10 space-y-10">
        <div className="space-y-2">
          <p>Global Controls</p>
          <hr />
          <div className="space-y-3">
            <div className="flex items-center gap-5">
              <BPM />
              <Loop />
            </div>
            <MasterVolume />
          </div>
        </div>
        <div className="space-y-2">
          <p>Playback Controls</p>
          <hr />
          <div className="flex items-center gap-5">
            <Playback />
          </div>
        </div>
      </div>
      {/* <PlaybackControls /> */}
    </div>
  );
}
