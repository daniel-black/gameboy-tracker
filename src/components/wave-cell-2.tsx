import { useWaveCell } from "@/hooks/use-wave-cell";
import { activeCellAtom } from "@/store";
import { useSetAtom } from "jotai";
import { NoteInput } from "./note-input";

export function WaveCell2(props: { row: number }) {
  const [cell, setCell] = useWaveCell(props.row);
  const setActiveCell = useSetAtom(activeCellAtom);

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 3) return;

    const newCell = { ...cell, volume: e.target.value };
    setCell(newCell);
  }

  function handleWaveFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 3) return;

    const newCell = { ...cell, waveForm: e.target.value.toUpperCase() };
    setCell(newCell);
  }

  function handleTabToNextCell(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab" && !e.shiftKey) {
      // Let the default tab behavior work, but update the active cell
      setTimeout(() => {
        setActiveCell({ row: props.row, col: 3 });
      }, 0);
    }
  }

  function setPreviousCellAsActive() {
    setTimeout(() => {
      setActiveCell({ row: props.row, col: 1 });
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
        placeholder="⋅⋅⋅"
        className="w-6 focus:outline-0"
        value={cell.volume}
        onChange={handleVolumeChange}
      />

      {/* Wave Form */}
      <input
        type="text"
        placeholder="⋅⋅⋅"
        className="w-6 focus:outline-0"
        value={cell.waveForm}
        onChange={handleWaveFormChange}
        onKeyDown={handleTabToNextCell}
      />
    </>
  );
}
