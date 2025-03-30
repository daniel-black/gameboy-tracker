import { ROWS_PER_PATTERN } from "../audio/constants";
import { NoiseCell } from "./noise-cell";
import { PlaybackOverlay } from "./playback-overlay";
import { Pulse1Cell } from "./pulse1-cell";
import { Pulse2Cell } from "./pulse2-cell";
import { ScrollArea } from "./ui/scroll-area";
import { WaveCell } from "./wave-cell";

export function PatternGrid() {
  return (
    <ScrollArea className="mt-[4vh] h-[96vh]">
      <PlaybackOverlay />
      {Array.from({ length: ROWS_PER_PATTERN }).map((_, row) => (
        <div
          className={`flex group ${row % 4 === 0 ? "bg-slate-50" : ""}`}
          key={`row-num-${row}`}
        >
          <div
            className="border w-8 h-8 flex items-center justify-center group-hover:bg-slate-100 text-muted-foreground select-none text-xs" // do more w this group hover stuff
          >
            {row < 10 ? `0${row}` : row}
          </div>
          <Pulse1Cell key={`pulse1-${row}`} row={row} />
          <Pulse2Cell key={`pulse2-${row}`} row={row} />
          <WaveCell key={`wave-${row}`} row={row} />
          <NoiseCell key={`noise-${row}`} row={row} />
        </div>
      ))}
    </ScrollArea>
  );
}
