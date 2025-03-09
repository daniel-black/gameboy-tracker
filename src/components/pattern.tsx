import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  Channel,
  setRowEffect,
  setRowNote,
  setRowVolume,
} from "../store/slices/song-slice";

const rows = Array.from({ length: 64 });

export function Pattern({ patternIndex }: { patternIndex: number }) {
  return (
    <div>
      <p>Pattern {patternIndex}</p>
      <p>pulse1</p>
      <div>
        {rows.map((_, i) => (
          <Row
            key={i}
            patternIndex={patternIndex}
            channel="pulse1"
            rowIndex={i}
          />
        ))}
      </div>
      <p>pulse2</p>
      <div>
        {rows.map((_, i) => (
          <Row
            key={i}
            patternIndex={patternIndex}
            channel="pulse2"
            rowIndex={i}
          />
        ))}
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
    <div>
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
      <label>note</label>
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
      <label>volume</label>
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
      <label>effect</label>
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
      />
    </div>
  );
}
