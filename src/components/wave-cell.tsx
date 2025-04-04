import { useWaveCell } from "@/hooks/use-wave-cell";
import { activeCellAtom } from "@/store";
import { useSetAtom } from "jotai";
import { NoteInput } from "./note-input";
import { WaveVolumeInput } from "./wave-volume-input";
import { WaveFormInput } from "./wave-form-input";

export function WaveCell(props: { row: number }) {
  const [cell, setCell] = useWaveCell(props.row);
  const setActiveCell = useSetAtom(activeCellAtom);

  const setNote = (newNote: string) => setCell({ ...cell, note: newNote });
  const setVolume = (newVolume: string) =>
    setCell({ ...cell, volume: newVolume });
  const setWaveForm = (newWaveForm: string) =>
    setCell({ ...cell, waveForm: newWaveForm });

  function setPreviousCellAsActive() {
    setTimeout(() => {
      setActiveCell({ row: props.row, col: 1 });
    }, 0);
  }

  function setNextCellAsActive() {
    setTimeout(() => {
      setActiveCell({ row: props.row, col: 3 });
    }, 0);
  }

  return (
    <>
      <NoteInput
        note={cell.note}
        setNote={setNote}
        setPreviousCellAsActive={setPreviousCellAsActive}
      />

      <WaveVolumeInput volume={cell.volume} setVolume={setVolume} />

      <WaveFormInput
        waveForm={cell.waveForm}
        setWaveForm={setWaveForm}
        setNextCellAsActive={setNextCellAsActive}
      />
    </>
  );
}
