import { activeCellAtom } from "@/store";
import { useAtom } from "jotai";
import { NoteInput } from "./note-input";
import { VolumeInput } from "./volume-input";
import { DutyCycleInput } from "./duty-cycle-input";
import { useCell } from "@/hooks/use-cell";

export function Pulse1Cell(props: { row: number }) {
  const [cell, setCell] = useCell({ channel: "pulse1", row: props.row });
  const [activeCell, setActiveCell] = useAtom(activeCellAtom);

  const isActive =
    activeCell && activeCell.row === props.row && activeCell.col === 0;

  const setNote = (newNote: string) => setCell({ ...cell, note: newNote });
  const setVolume = (newVolume: string) =>
    setCell({ ...cell, volume: newVolume });
  const setDutyCycle = (newDutyCycle: string) =>
    setCell({ ...cell, dutyCycle: newDutyCycle });

  function setPreviousCellAsActive() {
    setTimeout(() => {
      setActiveCell({ row: props.row > 0 ? props.row - 1 : 0, col: 3 });
    }, 0);
  }

  function setNextCellAsActive() {
    setTimeout(() => {
      setActiveCell({ row: props.row, col: 1 });
    }, 0);
  }

  return (
    <td
      onClick={() => setActiveCell({ row: props.row, col: 0 })}
      className={`border border-gray-300 py-0.5 px-1 ${
        isActive ? "bg-gray-100" : ""
      }`}
    >
      <div className="flex justify-around items-center gap-1">
        <NoteInput
          note={cell.note}
          setNote={setNote}
          setPreviousCellAsActive={setPreviousCellAsActive}
        />

        <VolumeInput volume={cell.volume} setVolume={setVolume} />

        <DutyCycleInput
          dutyCycle={cell.dutyCycle}
          setDutyCycle={setDutyCycle}
          setNextCellAsActive={setNextCellAsActive}
        />
      </div>
    </td>
  );
}
