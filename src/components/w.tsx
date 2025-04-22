import { useCell } from "@/hooks/use-cell";
import { NoteInput2 } from "./note-input2";
import { WaveVolumeInput2 } from "./wave-volume-input2";
import { WaveFormInput2 } from "./wave-form-input2";
import { memo } from "react";

// input count: 3

export const W = memo(
  function W(props: {
    row: number;
    isActive: boolean;
    setAsActive: () => void;
  }) {
    const [cell, setCell] = useCell({ channel: "wave", row: props.row });

    const setNote = (newNote: string) => setCell({ ...cell, note: newNote });
    const setVolume = (newVolume: string) =>
      setCell({ ...cell, volume: newVolume });
    const setWaveForm = (newWaveForm: string) =>
      setCell({ ...cell, waveForm: newWaveForm });

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
        <div className="flex justify-around items-center gap-1 ">
          <NoteInput2
            note={cell.note}
            setNote={setNote}
            setAsActive={setAsActive}
          />
          <WaveVolumeInput2
            volume={cell.volume}
            setVolume={setVolume}
            setAsActive={setAsActive}
          />
          <WaveFormInput2
            waveForm={cell.waveForm}
            setWaveForm={setWaveForm}
            setAsActive={setAsActive}
          />
        </div>
      </td>
    );
  },
  (prevProps, nextProps) =>
    prevProps.row === nextProps.row && prevProps.isActive === nextProps.isActive
);
