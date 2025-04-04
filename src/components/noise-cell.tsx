import { useNoiseCell } from "@/hooks/use-noise-cell";
import { activeCellAtom } from "@/store";
import { useSetAtom } from "jotai";
import { VolumeInput } from "./volume-input";

export function NoiseCell(props: { row: number }) {
  const [cell, setCell] = useNoiseCell(props.row);
  const setActiveCell = useSetAtom(activeCellAtom);

  const setVolume = (newVolume: string) =>
    setCell({ ...cell, volume: newVolume });

  function handleRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 3) return;

    const newCell = { ...cell, rate: e.target.value };
    setCell(newCell);
  }

  function setNextCellAsActive() {
    setTimeout(() => {
      setActiveCell({ row: props.row, col: 1 });
    }, 0);
  }

  function handleShiftTabToPrevCell(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab" && e.shiftKey) {
      // Let the default shift+tab behavior work, but update the active cell
      setTimeout(() => {
        setActiveCell({ row: props.row, col: 2 });
      }, 0);
    }
  }

  return (
    <>
      {/* Note */}
      <input
        type="text"
        placeholder="⋅⋅⋅"
        className="w-6 focus:outline-0"
        value={cell.rate}
        onChange={handleRateChange}
        onKeyDown={handleShiftTabToPrevCell}
      />

      {/* Volume */}
      <VolumeInput
        volume={cell.volume}
        setVolume={setVolume}
        setNextCellAsActive={setNextCellAsActive}
      />
    </>
  );
}
