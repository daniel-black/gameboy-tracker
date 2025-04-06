import { CHANNELS, ROWS_PER_PATTERN } from "@/audio/constants";
import { ChannelLabel } from "./channel-label";
import { Pulse1Cell } from "./pulse1-cell";
import { Pulse2Cell } from "./pulse2-cell";
import { WaveCell } from "./wave-cell";
import { NoiseCell } from "./noise-cell";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { activeCellAtom } from "@/store";

// Generate row headers (00 through 64)
const rowHeaders = Array.from({ length: ROWS_PER_PATTERN }, (_, i) =>
  i < 10 ? `0${i}` : i.toString()
);

export function Grid() {
  const setActiveCell = useSetAtom(activeCellAtom);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // set active cell to null if ESC is pressed
      if (e.key === "Escape") {
        setActiveCell(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setActiveCell]);

  return (
    <div className="flex flex-col max-w-full overflow-x-auto text-xs">
      <div className="inline-block min-w-full max-h-screen overflow-y-auto relative">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr>
              {/* Empty top-left cell */}
              <th className="border border-gray-300 bg-gray-100"></th>

              {CHANNELS.map((channel, index) => (
                <th
                  scope="col"
                  key={index}
                  className="border border-gray-300 bg-gray-100 select-none px-2 py-1"
                >
                  <ChannelLabel channel={channel} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Create 64 rows (plus the header row) */}
            {rowHeaders.map((rowHeader, rowIndex) => (
              <tr key={rowIndex}>
                {/* Row header cell */}
                <td className="border border-gray-300 py-0.5 px-1 text-muted-foreground bg-gray-50 text-center select-none">
                  {rowHeader}
                </td>
                <Pulse1Cell row={rowIndex} />
                <Pulse2Cell row={rowIndex} />
                <WaveCell row={rowIndex} />
                <NoiseCell row={rowIndex} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
