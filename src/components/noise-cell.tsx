import { useNoiseCell } from "@/hooks/use-noise-cell";
import { activeCellAtom } from "@/store";
import { useSetAtom } from "jotai";

export function NoiseCell(props: { row: number }) {
  const [cell, setCell] = useNoiseCell(props.row);
  const setActiveCell = useSetAtom(activeCellAtom);

  function handleRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 3) return;

    const newCell = { ...cell, rate: e.target.value };
    setCell(newCell);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 2) return;

    const newCell = { ...cell, volume: e.target.value };
    setCell(newCell);
  }

  function handleTabToNextCell(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab" && !e.shiftKey) {
      // Let the default tab behavior work, but update the active cell
      setTimeout(() => {
        setActiveCell({ row: props.row < 63 ? props.row + 1 : 0, col: 0 });
      }, 0);
    }
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
      <input
        type="text"
        placeholder="⋅⋅"
        className="w-4 focus:outline-0"
        value={cell.volume}
        onChange={handleVolumeChange}
        onKeyDown={handleTabToNextCell}
      />
    </>
  );
}
