import { activeAtom } from "@/store";
import { useAtom } from "jotai";

export function useActive() {
  const [active, setInternalActive] = useAtom(activeAtom);

  function setActiveRow(row: number | null) {
    setInternalActive({
      row,
      col: null,
    });
  }

  function setActiveCell(row: number | null, col: number | null) {
    setInternalActive({
      row,
      col,
    });
  }

  function clearActive() {
    setInternalActive({
      row: null,
      col: null,
    });
  }

  return {
    active,
    setActiveRow,
    setActiveCell,
    clearActive,
  };
}
