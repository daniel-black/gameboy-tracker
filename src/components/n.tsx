import { useCell } from "@/hooks/use-cell";
import { NoiseRateInput2 } from "./noise-rate-input2";
import { VolumeInput2 } from "./volume-input2";
import { EnvelopeInput2 } from "./envelope-input2";
import { memo } from "react";

// input count: 3

export const N = memo(
  function N(props: {
    row: number;
    isActive: boolean;
    setAsActive: () => void;
  }) {
    const [cell, setCell] = useCell({ channel: "noise", row: props.row });

    const setVolume = (newVolume: string) =>
      setCell({ ...cell, volume: newVolume });
    const setRate = (newRate: string) => setCell({ ...cell, rate: newRate });
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
          <NoiseRateInput2
            rate={cell.rate}
            setRate={setRate}
            setAsActive={setAsActive}
          />
          <VolumeInput2
            volume={cell.volume}
            setVolume={setVolume}
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
