import { Pulse1Cell } from "@/audio/cell";
import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { useEffect, useState } from "react";

export function usePulse1Cell(row: number) {
  const [cell, setCell] = useState(tracker.getPulse1Cell(row));

  useEffect(() => {
    const handleChangedPulse1Cell = (
      eventData: TrackerEventMap["changedPulse1Cell"]
    ) => {
      if (eventData.row === row) {
        setCell(tracker.getPulse1Cell(eventData.row));
      }
    };
    const handleChangedCurrentPatternEvent = (
      _: TrackerEventMap["changedCurrentPattern"]
    ) => {
      setCell(tracker.getPulse1Cell(row));
    };

    tracker.emitter.on("changedPulse1Cell", handleChangedPulse1Cell);
    tracker.emitter.on(
      "changedCurrentPattern",
      handleChangedCurrentPatternEvent
    );

    return () => {
      tracker.emitter.off("changedPulse1Cell", handleChangedPulse1Cell);
      tracker.emitter.off(
        "changedCurrentPattern",
        handleChangedCurrentPatternEvent
      );
    };
  }, []);

  function setPulse1Cell(newCell: Pulse1Cell) {
    tracker.setPulse1Cell(row, newCell);
  }

  return [cell, setPulse1Cell] as const;
}
