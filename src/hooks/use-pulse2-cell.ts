import { Pulse2Cell } from "@/audio/cell";
import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { useEffect, useState } from "react";

export function usePulse2Cell(row: number) {
  const [cell, setCell] = useState(tracker.getPulse2Cell(row));

  useEffect(() => {
    const handleChangedPulse2Cell = (
      eventData: TrackerEventMap["changedPulse2Cell"]
    ) => {
      if (eventData.row === row) {
        setCell(tracker.getPulse2Cell(eventData.row));
      }
    };
    const handleChangedCurrentPatternEvent = (
      _: TrackerEventMap["changedCurrentPattern"]
    ) => {
      setCell(tracker.getPulse2Cell(row));
    };

    tracker.emitter.on("changedPulse2Cell", handleChangedPulse2Cell);
    tracker.emitter.on(
      "changedCurrentPattern",
      handleChangedCurrentPatternEvent
    );

    return () => {
      tracker.emitter.off("changedPulse2Cell", handleChangedPulse2Cell);
      tracker.emitter.off(
        "changedCurrentPattern",
        handleChangedCurrentPatternEvent
      );
    };
  }, []);

  function setPulse2Cell(newCell: Pulse2Cell) {
    tracker.setPulse2Cell(row, newCell);
  }

  return [cell, setPulse2Cell] as const;
}
