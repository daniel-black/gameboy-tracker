import { NoteInput } from "./note-input";
import { VolumeInput } from "./volume-input";
import { DutyCycleInput } from "./duty-cycle-input";
import { useCell } from "@/hooks/use-cell";
import { EnvelopeInput } from "./envelope-input";
import { SweepInput } from "./sweep-input";

// input count: 5

export function Pulse1Cell(props: { row: number }) {
  const [cell, setCell] = useCell({ channel: "pulse1", row: props.row });

  const setNote = (newNote: string) => setCell({ ...cell, note: newNote });
  const setVolume = (newVolume: string) =>
    setCell({ ...cell, volume: newVolume });
  const setDutyCycle = (newDutyCycle: string) =>
    setCell({ ...cell, dutyCycle: newDutyCycle });
  const setEnvelope = (newEnvelope: string) =>
    setCell({ ...cell, envelope: newEnvelope });
  const setSweep = (newSweep: string) => setCell({ ...cell, sweep: newSweep });

  return (
    <div className="flex justify-around items-center gap-1">
      <NoteInput note={cell.note} setNote={setNote} />
      <VolumeInput volume={cell.volume} setVolume={setVolume} />
      <DutyCycleInput dutyCycle={cell.dutyCycle} setDutyCycle={setDutyCycle} />
      <EnvelopeInput envelope={cell.envelope} setEnvelope={setEnvelope} />
      <SweepInput sweep={cell.sweep} setSweep={setSweep} />
    </div>
  );
}
