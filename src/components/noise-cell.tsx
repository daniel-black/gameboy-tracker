import { VolumeInput } from "./volume-input";
import { NoiseRateInput } from "./noise-rate-input";
import { useCell } from "@/hooks/use-cell";
import { EnvelopeInput } from "./envelope-input";

// input count: 3

export function NoiseCell(props: { row: number }) {
  const [cell, setCell] = useCell({ row: props.row, col: 3 });

  const setVolume = (newVolume: string) =>
    setCell({ ...cell, volume: newVolume });
  const setRate = (newRate: string) => setCell({ ...cell, rate: newRate });
  const setEnvelope = (newEnvelope: string) =>
    setCell({ ...cell, envelope: newEnvelope });

  return (
    <div className="flex justify-around items-center gap-1">
      {cell.rate && <NoiseRateInput rate={cell.rate} setRate={setRate} />}
      <VolumeInput volume={cell.volume} setVolume={setVolume} />
      {cell.envelope && (
        <EnvelopeInput envelope={cell.envelope} setEnvelope={setEnvelope} />
      )}
    </div>
  );
}
