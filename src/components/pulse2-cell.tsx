import { usePulse2Cell } from "@/hooks/use-pulse2-cell";
import { activeCellAtom } from "@/store";
import { useSetAtom } from "jotai";
import { NoteInput } from "./note-input";

export function Pulse2Cell(props: { row: number }) {
  const [cell, setCell] = usePulse2Cell(props.row);
  const setActiveCell = useSetAtom(activeCellAtom);

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
        setActiveCell({ row: props.row, col: 2 });
      }, 0);
    }
  }

  function setPreviousCellAsActive() {
    setTimeout(() => {
      setActiveCell({ row: props.row, col: 0 });
    }, 0);
  }

  return (
    <>
      {/* Note */}
      <NoteInput
        value={cell.note}
        onChange={(newNote: string) => setCell({ ...cell, note: newNote })}
        setPreviousCellAsActive={setPreviousCellAsActive}
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
        onKeyDown={handleTabToNextCell}
      />
    </>
  );
}
