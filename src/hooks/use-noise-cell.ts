import { NoiseCell } from "@/audio/cell";
import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { useEffect, useState } from "react";

export function useNoiseCell(row: number) {
  const [cell, setCell] = useState(tracker.getNoiseCell(row));

  useEffect(() => {
    const handleChangedNoiseCell = (
      eventData: TrackerEventMap["changedNoiseCell"]
    ) => {
      if (eventData.row === row) {
        setCell(tracker.getNoiseCell(eventData.row));
      }
    };
    const handleChangedCurrentPatternEvent = (
      _: TrackerEventMap["changedCurrentPattern"]
    ) => {
      setCell(tracker.getNoiseCell(row));
    };

    tracker.emitter.on("changedNoiseCell", handleChangedNoiseCell);
    tracker.emitter.on(
      "changedCurrentPattern",
      handleChangedCurrentPatternEvent
    );

    return () => {
      tracker.emitter.off("changedNoiseCell", handleChangedNoiseCell);
      tracker.emitter.off(
        "changedCurrentPattern",
        handleChangedCurrentPatternEvent
      );
    };
  }, []);

  function setNoiseCell(newCell: NoiseCell) {
    tracker.setNoiseCell(row, newCell);
  }

  return [cell, setNoiseCell] as const;
}
