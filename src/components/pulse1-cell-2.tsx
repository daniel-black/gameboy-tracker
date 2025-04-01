import { usePulse1Cell } from "@/hooks/use-pulse1-cell";
import { activeCellAtom } from "@/store";
import { useSetAtom } from "jotai";

export function Pulse1Cell2(props: { row: number }) {
  const [cell, setCell] = usePulse1Cell(props.row);
  const setActiveCell = useSetAtom(activeCellAtom);

  function handleNoteChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 3) return;

    const newNote = e.target.value.toUpperCase();
    const newCell = { ...cell, note: newNote };
    setCell(newCell);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 2) return;

    const newCell = { ...cell, volume: e.target.value };
    setCell(newCell);
  }

  function handleDutyCycleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 2) return;

    const newCell = { ...cell, dutyCycle: e.target.value };
    setCell(newCell);
  }

  function handleTabToNextCell(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab" && !e.shiftKey) {
      // Let the default tab behavior work, but update the active cell
      setTimeout(() => {
        setActiveCell({ row: props.row, col: 1 });
      }, 0);
    }
  }

  function handleShiftTabToPrevCell(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab" && e.shiftKey) {
      // Let the default shift+tab behavior work, but update the active cell
      setTimeout(() => {
        setActiveCell({ row: props.row > 0 ? props.row - 1 : 0, col: 3 });
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
        value={cell.note}
        onChange={handleNoteChange}
        onKeyDown={handleShiftTabToPrevCell} // sets active cell to previous cell
      />

      {/* Volume */}
      <input
        type="text"
        placeholder="⋅⋅"
        className="w-4 focus:outline-0"
        value={cell.volume}
        onChange={handleVolumeChange}
      />

      {/* Duty cycle */}
      <input
        type="text"
        placeholder="⋅⋅"
        className="w-4 focus:outline-0"
        value={cell.dutyCycle}
        onChange={handleDutyCycleChange}
        onKeyDown={handleTabToNextCell} // sets active cell to next cell
      />
    </>
  );
}
