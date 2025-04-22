import { useCell } from "@/hooks/use-cell";
import { NoteInput2 } from "./note-input2";
import { VolumeInput2 } from "./volume-input2";
import { DutyCycleInput2 } from "./duty-cycle-input2";
import { EnvelopeInput2 } from "./envelope-input2";
import { memo } from "react";

// input count: 4

export const P2 = memo(
  function P2(props: {
    row: number;
    isActive: boolean;
    setAsActive: () => void;
  }) {
    const [cell, setCell] = useCell({ channel: "pulse2", row: props.row });

    const setNote = (newNote: string) => setCell({ ...cell, note: newNote });
    const setVolume = (newVolume: string) =>
      setCell({ ...cell, volume: newVolume });
    const setDutyCycle = (newDutyCycle: string) =>
      setCell({ ...cell, dutyCycle: newDutyCycle });
    const setEnvelope = (newEnvelope: string) =>
      setCell({ ...cell, envelope: newEnvelope });

    function setAsActive() {
      if (!props.isActive) {
        props.setAsActive();
      }
    }

    return (
      <td
        data-active={props.isActive}
        className="border px-2 data-[active=true]:bg-blue-200"
        onClick={setAsActive}
      >
        <div className="flex justify-around items-center gap-1">
          <NoteInput2
            note={cell.note}
            setNote={setNote}
            setAsActive={setAsActive}
          />
          <VolumeInput2
            volume={cell.volume}
            setVolume={setVolume}
            setAsActive={setAsActive}
          />
          <DutyCycleInput2
            dutyCycle={cell.dutyCycle}
            setDutyCycle={setDutyCycle}
            setAsActive={setAsActive}
          />
          <EnvelopeInput2
            envelope={cell.envelope}
            setEnvelope={setEnvelope}
            setAsActive={setAsActive}
          />
        </div>
      </td>
    );
  },
  (prevProps, nextProps) =>
    prevProps.row === nextProps.row && prevProps.isActive === nextProps.isActive
);
