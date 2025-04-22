import { NoteInput } from "./note-input";
import { VolumeInput } from "./volume-input";
import { DutyCycleInput } from "./duty-cycle-input";
import { useCell } from "@/hooks/use-cell";
import { EnvelopeInput } from "./envelope-input";

// input count: 4

export function Pulse2Cell(props: { row: number }) {
  const [cell, setCell] = useCell({ channel: "pulse2", row: props.row });

  const setNote = (newNote: string) => setCell({ ...cell, note: newNote });
  const setVolume = (newVolume: string) =>
    setCell({ ...cell, volume: newVolume });
  const setDutyCycle = (newDutyCycle: string) =>
    setCell({ ...cell, dutyCycle: newDutyCycle });
  const setEnvelope = (newEnvelope: string) =>
    setCell({ ...cell, envelope: newEnvelope });

  return (
    <div className="flex justify-around items-center gap-1">
      <NoteInput note={cell.note} setNote={setNote} />
      <VolumeInput volume={cell.volume} setVolume={setVolume} />
      <DutyCycleInput dutyCycle={cell.dutyCycle} setDutyCycle={setDutyCycle} />
      <EnvelopeInput envelope={cell.envelope} setEnvelope={setEnvelope} />
    </div>
  );
}
