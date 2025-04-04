import { usePulse2Cell } from "@/hooks/use-pulse2-cell";
import { activeCellAtom } from "@/store";
import { useSetAtom } from "jotai";
import { NoteInput } from "./note-input";
import { VolumeInput } from "./volume-input";
import { DutyCycleInput } from "./duty-cycle-input";

export function Pulse2Cell(props: { row: number }) {
  const [cell, setCell] = usePulse2Cell(props.row);
  const setActiveCell = useSetAtom(activeCellAtom);

  const setNote = (newNote: string) => setCell({ ...cell, note: newNote });
  const setVolume = (newVolume: string) =>
    setCell({ ...cell, volume: newVolume });
  const setDutyCycle = (newDutyCycle: string) =>
    setCell({ ...cell, dutyCycle: newDutyCycle });

  function setPreviousCellAsActive() {
    setTimeout(() => {
      setActiveCell({ row: props.row, col: 0 });
    }, 0);
  }

  function setNextCellAsActive() {
    setTimeout(() => {
      setActiveCell({ row: props.row, col: 2 });
    }, 0);
  }

  return (
    <>
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
    </>
  );
}
