import { activeCellAtom } from "@/store";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Pulse1Cell } from "./pulse1-cell";
import { Pulse2Cell } from "./pulse2-cell";
import { WaveCell } from "./wave-cell";
import { NoiseCell } from "./noise-cell";

type CellProps = {
  row: number;
  col: number;
};

export function Cell({ row, col }: CellProps) {
  const [activeCell, setActiveCell] = useAtom(activeCellAtom);

  const isActive =
    activeCell && activeCell.row === row && activeCell.col === col;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveCell(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <td
      onClick={() => setActiveCell({ row, col })}
      className={`border border-gray-300 py-0.5 px-1 ${
        isActive ? "bg-gray-100" : ""
      }`}
    >
      <div className="flex justify-around items-center gap-1">
        {col === 0 && <Pulse1Cell row={row} />}
        {col === 1 && <Pulse2Cell row={row} />}
        {col === 2 && <WaveCell row={row} />}
        {col === 3 && <NoiseCell row={row} />}
      </div>
    </td>
  );
}
