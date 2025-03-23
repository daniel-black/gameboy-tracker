import { ROWS_PER_PATTERN } from "../audio/constants";
import { ChannelToggle } from "./channel-toggle";
import { NoiseCell } from "./noise-cell";
import { PlaybackOverlay } from "./playback-overlay";
import { Pulse1Cell } from "./pulse1-cell";
import { Pulse2Cell } from "./pulse2-cell";
import { WaveCell } from "./wave-cell";

export function PatternGrid() {
  return (
    <div className="relative">
      {/* Channel Headers */}
      <div className="flex mb-2">
        <div className="w-[46px]"></div>
        <div className="w-[345px] px-3 font-bold space-x-3">
          <ChannelToggle channel="pulse1" />
          <span>Pulse Wave 1</span>
        </div>
        <div className="w-[345px] px-3 font-bold space-x-3">
          <ChannelToggle channel="pulse2" />
          <span>Pulse Wave 2</span>
        </div>
        <div className="w-[345px] px-3 font-bold space-x-3">
          <ChannelToggle channel="wave" />
          <span>Wave</span>
        </div>
        <div className="w-fit px-3 font-bold space-x-3">
          <ChannelToggle channel="noise" />
          <span>Noise</span>
        </div>
      </div>

      {/* Pattern rows container */}
      <div className="relative">
        <PlaybackOverlay />
        {Array.from({ length: ROWS_PER_PATTERN }).map((_, row) => (
          <div
            className={`flex group ${row % 4 === 0 ? "bg-slate-50" : ""}`}
            key={`row-num-${row}`}
          >
            <div
              className="border px-3 py-0.5 h-14 flex items-center group-hover:bg-slate-100 text-muted-foreground select-none" // do more w this group hover stuff
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
