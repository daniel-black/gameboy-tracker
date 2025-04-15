import { Cell } from "@/audio/cell";
import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { ChannelType } from "@/audio/types";
import { useCallback, useEffect, useState } from "react";

type UseCellProps<T extends ChannelType> = {
  channel: T;
  row: number;
};

export function useCell<T extends ChannelType>({
  channel,
  row,
}: UseCellProps<T>) {
  const [cell, setInternalCell] = useState<Cell[T]>(
    tracker.getCell(channel, row)
  );

  useEffect(() => {
    const handleChangedCurrentPatternEvent = (
      _: TrackerEventMap["changedCurrentPattern"]
    ) => {
      setInternalCell(tracker.getCell(channel, row));
    };

    const handleChangedCellEvent = (
      eventData: TrackerEventMap["changedCell"]
    ) => {
      if (eventData.channel === channel && eventData.row === row) {
        setInternalCell(
          tracker.getCell(eventData.channel, eventData.row) as Cell[T]
        );
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
  }, [channel, row]);

  const setCell = useCallback(
    (newCell: Cell[T]) => {
      tracker.setCell(channel, row, newCell);
    },
    [channel, row]
  );

  return [cell, setCell] as const;
}
