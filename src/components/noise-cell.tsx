import { activeCellAtom } from "@/store";
import { useAtom } from "jotai";
import { VolumeInput } from "./volume-input";
import { NoiseRateInput } from "./noise-rate-input";
import { useCell } from "@/hooks/use-cell";

export function NoiseCell(props: { row: number }) {
  const [cell, setCell] = useCell({ channel: "noise", row: props.row });
  const [activeCell, setActiveCell] = useAtom(activeCellAtom);

  const isActive =
    activeCell && activeCell.row === props.row && activeCell.col === 3;

  const setVolume = (newVolume: string) =>
    setCell({ ...cell, volume: newVolume });
  const setRate = (newRate: string) => setCell({ ...cell, rate: newRate });

  function setNextCellAsActive() {
    setTimeout(() => {
      setActiveCell({ row: props.row < 63 ? props.row + 1 : 0, col: 0 });
    }, 0);
  }

  function setPreviousCellAsActive() {
    setTimeout(() => {
      setActiveCell({ row: props.row, col: 2 });
    }, 0);
  }

  return (
    <td
      onClick={() => setActiveCell({ row: props.row, col: 3 })}
      className={`border border-gray-300 py-0.5 px-1 ${
        isActive ? "bg-gray-100" : ""
      }`}
    >
      <div className="flex justify-around items-center gap-1">
        <NoiseRateInput
          rate={cell.rate}
          setRate={setRate}
          setPreviousCellAsActive={setPreviousCellAsActive}
        />

        <VolumeInput
          volume={cell.volume}
          setVolume={setVolume}
          setNextCellAsActive={setNextCellAsActive}
        />
      </div>
    </td>
  );
}
