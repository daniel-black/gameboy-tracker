import { WaveCell } from "@/audio/cell";
import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { useEffect, useState } from "react";

export function useWaveCell(row: number) {
  const [cell, setCell] = useState(tracker.getWaveCell(row));

  useEffect(() => {
    const handleChangedWaveCell = (
      eventData: TrackerEventMap["changedWaveCell"]
    ) => {
      if (eventData.row === row) {
        setCell(tracker.getWaveCell(eventData.row));
      }
    };
    const handleChangedCurrentPatternEvent = (
      _: TrackerEventMap["changedCurrentPattern"]
    ) => {
      setCell(tracker.getWaveCell(row));
    };

    tracker.emitter.on("changedWaveCell", handleChangedWaveCell);
    tracker.emitter.on(
      "changedCurrentPattern",
      handleChangedCurrentPatternEvent
    );

    return () => {
      tracker.emitter.off("changedWaveCell", handleChangedWaveCell);
      tracker.emitter.off(
        "changedCurrentPattern",
        handleChangedCurrentPatternEvent
      );
    };
  }, []);

  function setWaveCell(newCell: WaveCell) {
    tracker.setWaveCell(row, newCell);
  }

  return [cell, setWaveCell] as const;
}
