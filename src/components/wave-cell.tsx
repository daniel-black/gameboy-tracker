import { NoteInput } from "./note-input";
import { WaveVolumeInput } from "./wave-volume-input";
import { WaveFormInput } from "./wave-form-input";
import { useCell } from "@/hooks/use-cell";

export function WaveCell(props: { row: number }) {
  const [cell, setCell] = useCell({ channel: "wave", row: props.row });

  const setNote = (newNote: string) => setCell({ ...cell, note: newNote });
  const setVolume = (newVolume: string) =>
    setCell({ ...cell, volume: newVolume });
  const setWaveForm = (newWaveForm: string) =>
    setCell({ ...cell, waveForm: newWaveForm });

  return (
    <div className="flex justify-around items-center gap-1">
      <NoteInput note={cell.note} setNote={setNote} />
      <WaveVolumeInput volume={cell.volume} setVolume={setVolume} />
      <WaveFormInput waveForm={cell.waveForm} setWaveForm={setWaveForm} />
    </div>
    // </td>
  );
}
