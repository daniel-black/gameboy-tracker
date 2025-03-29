import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { useCallback, useEffect, useState } from "react";

export function useCurrentPatternId() {
  const [patternId, setPatternId] = useState(tracker.getCurrentPatternId());

  useEffect(() => {
    const handleChangedCurrentPatternEvent = (
      eventData: TrackerEventMap["changedCurrentPattern"]
    ) => {
      setPatternId(eventData.patternId);
    };

    tracker.emitter.on(
      "changedCurrentPattern",
      handleChangedCurrentPatternEvent
    );

    return () => {
      tracker.emitter.off(
        "changedCurrentPattern",
        handleChangedCurrentPatternEvent
      );
    };
  }, []);

  const setCurrentPatternId = useCallback((patternId: string) => {
    tracker.setCurrentPatternId(patternId);
  }, []);

  return [patternId, setCurrentPatternId] as const;
}
