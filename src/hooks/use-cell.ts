import { UnifiedCell } from "@/audio/cell";
import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { ChannelIndex } from "@/audio/types";
import { useCallback, useEffect, useState } from "react";

type UseCellProps = {
  row: number;
  col: ChannelIndex;
};

export function useCell({ row, col }: UseCellProps) {
  const [cell, setInternalCell] = useState<UnifiedCell>(
    tracker.getCellData(row, col)
  );

  useEffect(() => {
    const handleChangedCurrentPatternEvent = (
      _: TrackerEventMap["changedCurrentPattern"]
    ) => {
      setInternalCell(tracker.getCellData(row, col));
    };

    const handleChangedCellEvent = (
      eventData: TrackerEventMap["changedCell"]
    ) => {
      if (eventData.col === col && eventData.row === row) {
        setInternalCell(tracker.getCellData(row, col));
      }
    };

    tracker.emitter.on(
      "changedCurrentPattern",
      handleChangedCurrentPatternEvent
    );
    tracker.emitter.on("changedCell", handleChangedCellEvent);

    return () => {
      tracker.emitter.off(
        "changedCurrentPattern",
        handleChangedCurrentPatternEvent
      );
      tracker.emitter.off("changedCell", handleChangedCellEvent);
    };
  }, [row, col]);

  const setCell = useCallback(
    (newCell: UnifiedCell) => {
      tracker.setCellData(row, col, newCell);
    },
    [row, col]
  );

  return [cell, setCell] as const;
}
