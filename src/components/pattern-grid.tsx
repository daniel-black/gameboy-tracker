import { ROWS_PER_PATTERN } from "../audio/constants";
import { Pulse1Cell } from "./pulse1-cell";
import { Pulse2Cell } from "./pulse2-cell";

export function PatternGrid() {
  return (
    <div>
      {Array.from({ length: ROWS_PER_PATTERN }).map((_, row) => (
        <div className="flex group">
          <div
            key={`row-num-${row}`}
            className="border px-2 py-0.5 group-hover:bg-slate-100" // do more w this group hover stuff
          >
            {row < 10 ? `0${row}` : row}
          </div>
          <Pulse1Cell key={`pulse1-${row}`} row={row} />
          <Pulse2Cell key={`pulse2-${row}`} row={row} />
        </div>
      ))}
    </div>
  );
}
