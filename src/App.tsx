import { BPM } from "./components/bpm";
import { MasterVolume } from "./components/master-volume";
import { Playback } from "./components/playback";

export function App() {
  return (
    <div className="font-mono w-screen h-screen flex selection:bg-gray-300">
      {/* Left half of screen - grid */}
      <div>{/* Grid is gone for now while i refactor */}</div>

      {/* Right half of screen - controls & config */}
      <div className="m-5 space-y-10 flex-1">
        <div className="flex items-center gap-5">
          <Playback />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-5">
            <BPM />
          </div>
          <MasterVolume />
        </div>
      </div>
    </div>
  );
}
