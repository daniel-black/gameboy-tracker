import { activeCellAtom } from "@/store";
import { useAtom } from "jotai";
import { NoteInput } from "./note-input";
import { WaveVolumeInput } from "./wave-volume-input";
import { WaveFormInput } from "./wave-form-input";
import { useCell } from "@/hooks/use-cell";

export function WaveCell(props: { row: number }) {
  const [cell, setCell] = useCell({ channel: "wave", row: props.row });
  const [activeCell, setActiveCell] = useAtom(activeCellAtom);

  const isActive =
    activeCell && activeCell.row === props.row && activeCell.col === 2;

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
    <td
      onClick={() => setActiveCell({ row: props.row, col: 2 })}
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

        <WaveVolumeInput volume={cell.volume} setVolume={setVolume} />

        <WaveFormInput
          waveForm={cell.waveForm}
          setWaveForm={setWaveForm}
          setNextCellAsActive={setNextCellAsActive}
        />
      </div>
    </td>
  );
}
