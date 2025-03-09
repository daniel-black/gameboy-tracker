import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Channel, setChannelRowInPattern } from "../store/slices/song-slice";

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
  const dispatch = useAppDispatch();
  const row = useAppSelector(
    (s) => s.song.patterns[patternIndex][channel][rowIndex]
  );

  return (
    <div>
      <div>
        <label>note</label>
        <input
          type="number"
          value={row.note}
          onChange={(e) =>
            dispatch(
              setChannelRowInPattern({
                patternIndex,
                channel,
                rowIndex,
                newRow: { ...row, note: parseInt(e.target.value) },
              })
            )
          }
        />
      </div>
      <div>
        <label>volume</label>
        <input
          type="number"
          value={row.volume}
          onChange={(e) =>
            dispatch(
              setChannelRowInPattern({
                patternIndex,
                channel,
                rowIndex,
                newRow: { ...row, volume: parseInt(e.target.value) },
              })
            )
          }
        />
      </div>
      <div>
        <label>effect</label>
        <input
          type="number"
          value={row.effect}
          onChange={(e) =>
            dispatch(
              setChannelRowInPattern({
                patternIndex,
                channel,
                rowIndex,
                newRow: { ...row, effect: parseInt(e.target.value) },
              })
            )
          }
        />
      </div>
    </div>
  );
}
