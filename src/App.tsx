import "./app.css";
import { BPM } from "./components/bpm";
// import { Loop } from "./components/loop";
import { MasterVolume } from "./components/master-volume";
import { PatternGrid } from "./components/pattern-grid";
import { PatternManager } from "./components/pattern-manager";
import { Playback } from "./components/playback";

export function App() {
  return (
    <div className="font-mono flex">
      <div>
        <PatternGrid />
      </div>
      <div className="ml-10 space-y-10">
        <div className="flex items-center gap-5">
          <Playback />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-5">
            <BPM />
          </div>
          <MasterVolume />
        </div>
        <PatternManager />
      </div>
    </div>
  );
}
