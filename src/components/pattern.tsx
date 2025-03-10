import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  Channel,
  selectCurrentPatternIndex,
  setRowEffect,
  setRowNote,
  setRowVolume,
} from "../store/slices/song-slice";

const rows = Array.from({ length: 64 });

export function Pattern() {
  const currentPatternIndex = useAppSelector(selectCurrentPatternIndex);

  return (
    <div>
      <p>Pattern {currentPatternIndex}</p>
      <div className="flex flex-row text-xs">
        <div className="mr-4">
          <ul className="pt-4">
            {rows.map((_, i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
        <div>
          <p>pulse1</p>
          <div>
            {rows.map((_, i) => (
              <Row
                key={i}
                patternIndex={currentPatternIndex}
                channel="pulse1"
                rowIndex={i}
              />
            ))}
          </div>
        </div>
        <div>
          <p>pulse2</p>
          <div>
            {rows.map((_, i) => (
              <Row
                key={i}
                patternIndex={currentPatternIndex}
                channel="pulse2"
                rowIndex={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  patternIndex,
  channel,
  rowIndex,
}: {
  patternIndex: number;
  channel: Channel;
  rowIndex: number;
}) {
  return (
    <div className="flex max-w-fit">
      <RowNote
        patternIndex={patternIndex}
        channel={channel}
        rowIndex={rowIndex}
      />
      <RowVolume
        patternIndex={patternIndex}
        channel={channel}
        rowIndex={rowIndex}
      />
      <RowEffect
        patternIndex={patternIndex}
        channel={channel}
        rowIndex={rowIndex}
      />
    </div>
  );
}

function RowNote({
  patternIndex,
  channel,
  rowIndex,
}: {
  patternIndex: number;
  channel: Channel;
  rowIndex: number;
}) {
  const dispatch = useAppDispatch();
  const note = useAppSelector(
    (s) => s.song.patterns[patternIndex][channel][rowIndex].note
  );

  return (
    <div>
      <label>N</label>
      <input
        type="number"
        value={note}
        onChange={(e) =>
          dispatch(
            setRowNote({
              patternIndex,
              channel,
              rowIndex,
              note: parseInt(e.target.value),
            })
          )
        }
        className="w-14"
      />
    </div>
  );
}

function RowVolume({
  patternIndex,
  channel,
  rowIndex,
}: {
  patternIndex: number;
  channel: Channel;
  rowIndex: number;
}) {
  const dispatch = useAppDispatch();
  const volume = useAppSelector(
    (s) => s.song.patterns[patternIndex][channel][rowIndex].volume
  );

  return (
    <div>
      <label>V</label>
      <input
        type="number"
        value={volume}
        onChange={(e) =>
          dispatch(
            setRowVolume({
              patternIndex,
              channel,
              rowIndex,
              volume: parseInt(e.target.value),
            })
          )
        }
        className="w-14"
      />
    </div>
  );
}

function RowEffect({
  patternIndex,
  channel,
  rowIndex,
}: {
  patternIndex: number;
  channel: Channel;
  rowIndex: number;
}) {
  const dispatch = useAppDispatch();
  const effect = useAppSelector(
    (s) => s.song.patterns[patternIndex][channel][rowIndex].effect
  );

  return (
    <div>
      <label>E</label>
      <input
        type="number"
        value={effect}
        onChange={(e) =>
          dispatch(
            setRowEffect({
              patternIndex,
              channel,
              rowIndex,
              effect: parseInt(e.target.value),
            })
          )
        }
        className="w-14"
      />
    </div>
  );
}
