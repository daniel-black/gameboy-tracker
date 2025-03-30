import "./app.css";
import { BPM } from "./components/bpm";
import { ChannelLabel } from "./components/channel-label";
import { MasterVolume } from "./components/master-volume";
import { PatternGrid } from "./components/pattern-grid";
import { PatternHeader } from "./components/pattern-header";
import { PatternManager } from "./components/pattern-manager";
import { Playback } from "./components/playback";

export function App() {
  return (
    <div className="font-mono w-screen h-screen flex">
      <div>
        <PatternHeader />
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
        <ChannelLabel channel="pulse1" />
      </div>
    </div>
  );
}
