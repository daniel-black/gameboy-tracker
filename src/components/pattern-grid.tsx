import { ROWS_PER_PATTERN } from "../audio/constants";
import { Note } from "../audio/notes";
import { VolumeLevel } from "../audio/volume";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectCurrentPatternIndex,
  setRowNote,
  setRowVolume,
} from "../store/slices/song-slice";

const rowNumbers = Array.from({ length: ROWS_PER_PATTERN });

export function PatternGrid() {
  return (
    <main className="text-xs bg-slate-50 divide-y border max-w-fit">
      {rowNumbers.map((_, rowIndex) => (
        // this div is a row
        <div
          key={rowIndex}
          className={`flex hover:shadow-md hover:bg-blue-50 ${
            rowIndex % 4 === 0 ? "bg-gray-200" : ""
          }`}
        >
          <div
            className={`tabular-nums px-2 max-w-fit flex items-center justify-center`}
          >
            {rowIndex < 9 ? "0" + (rowIndex + 1) : rowIndex + 1}
          </div>
          <PulseCell channel="pulse1" rowIndex={rowIndex} />
          <PulseCell channel="pulse2" rowIndex={rowIndex} />
        </div>
      ))}
    </main>
  );
}

function PulseCell({
  rowIndex,
  channel,
}: {
  rowIndex: number;
  channel: "pulse1" | "pulse2";
}) {
  return (
    <div className="py-1 px-4 space-x-2 border-l">
      <PulseNote channel={channel} rowIndex={rowIndex} />
      <PulseVolume channel={channel} rowIndex={rowIndex} />
    </div>
  );
}

function PulseNote({
  rowIndex,
  channel,
}: {
  rowIndex: number;
  channel: "pulse1" | "pulse2";
}) {
  const dispatch = useAppDispatch();
  const patternIndex = useAppSelector(selectCurrentPatternIndex);
  const pulseNote = useAppSelector(
    (s) => s.song.patterns[patternIndex][channel][rowIndex].note
  );

  return (
    <input
      type="text"
      className="w-8 text-center"
      value={pulseNote}
      onChange={(e) =>
        dispatch(
          setRowNote({
            patternIndex,
            channel,
            rowIndex,
            note: e.target.value.toUpperCase() as Note,
          })
        )
      }
    />
  );
}

function PulseVolume({
  rowIndex,
  channel,
}: {
  rowIndex: number;
  channel: "pulse1" | "pulse2";
}) {
  const dispatch = useAppDispatch();
  const patternIndex = useAppSelector(selectCurrentPatternIndex);
  const pulseVolume = useAppSelector(
    (s) => s.song.patterns[patternIndex][channel][rowIndex].volume
  );

  return (
    <input
      type="number"
      className="w-8 text-center"
      value={pulseVolume}
      onChange={(e) =>
        dispatch(
          setRowVolume({
            patternIndex,
            channel,
            rowIndex,
            volume: parseInt(e.target.value) as VolumeLevel,
          })
        )
      }
    />
  );
}
