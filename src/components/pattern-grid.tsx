import { ROWS_PER_PATTERN } from "../audio/constants";
import { NoiseCell } from "./noise-cell";
import { PatternHeader } from "./pattern-header";
import { PlaybackOverlay } from "./playback-overlay";
import { Pulse1Cell } from "./pulse1-cell";
import { Pulse2Cell } from "./pulse2-cell";
import { WaveCell } from "./wave-cell";

export function PatternGrid() {
  return (
    <div className="relative">
      {/* Channel Headers */}
      <PatternHeader />

      {/* Pattern rows container */}
      <div className="relative">
        <PlaybackOverlay />
        {Array.from({ length: ROWS_PER_PATTERN }).map((_, row) => (
          <div
            className={`flex group ${row % 4 === 0 ? "bg-slate-50" : ""}`}
            key={`row-num-${row}`}
          >
            <div
              className="border px-3 py-0.5 h-12 flex items-center group-hover:bg-slate-100 text-muted-foreground select-none" // do more w this group hover stuff
            >
              {row < 10 ? `0${row}` : row}
            </div>
            <Pulse1Cell key={`pulse1-${row}`} row={row} />
            <Pulse2Cell key={`pulse2-${row}`} row={row} />
            <WaveCell key={`wave-${row}`} row={row} />
            <NoiseCell key={`noise-${row}`} row={row} />
          </div>
        ))}
      </div>
    </div>
  );
}
