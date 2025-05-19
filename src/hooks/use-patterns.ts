import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { PatternMetadata } from "@/audio/types";
import { useEffect, useState } from "react";

export function usePatterns() {
  const [currentPatternId, setCurrentPatternId] = useState(
    tracker.getCurrentPatternId()
  );
  const [patterns, setPatterns] = useState<Array<PatternMetadata>>(
    tracker.getAllPatternsMetadata()
  );

  useEffect(() => {
    const handleAddedPatternEvent = (
      eventData: TrackerEventMap["addedPattern"]
    ) => {
      console.log("Added pattern event:", eventData);
      setPatterns(tracker.getAllPatternsMetadata());
    };

    const handleDeletedPatternEvent = (
      _: TrackerEventMap["deletedPattern"]
    ) => {
      setPatterns(tracker.getAllPatternsMetadata());
    };

    const handleChangedCurrentPatternEvent = (
      eventData: TrackerEventMap["changedCurrentPattern"]
    ) => {
      setCurrentPatternId(eventData.patternId);
    };

    tracker.emitter.on("addedPattern", handleAddedPatternEvent);
    tracker.emitter.on("deletedPattern", handleDeletedPatternEvent);
    tracker.emitter.on(
      "changedCurrentPattern",
      handleChangedCurrentPatternEvent
    );

    return () => {
      tracker.emitter.off("addedPattern", handleAddedPatternEvent);
      tracker.emitter.off("deletedPattern", handleDeletedPatternEvent);
      tracker.emitter.off(
        "changedCurrentPattern",
        handleChangedCurrentPatternEvent
      );
    };
  });

  const addNewPattern = () => {
    tracker.addPattern();
  };

  const setCurrentPattern = (patternId: string) => {
    tracker.setCurrentPatternId(patternId);
  };

  const deletePattern = (patternId: string) => {
    tracker.deletePattern(patternId);
  };

  return {
    currentPatternId,
    patterns,
    addNewPattern,
    deletePattern,
    setCurrentPattern,
  };
}
