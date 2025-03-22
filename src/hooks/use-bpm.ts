import { useState, useEffect } from "react";
import { tracker } from "@/audio/tracker";
import { TrackerEventMap } from "@/audio/events";

/**
 * Custom hook for reading and writing tracker BPM
 * @returns {[number, (newBpm: number) => void]} A tuple containing the current BPM and a function to update it
 */
export function useBpm(): [number, (newBpm: number) => void] {
  const [bpm, setBpm] = useState(tracker.getBpm());

  useEffect(() => {
    const handleBpmChange = (eventData: TrackerEventMap["changedBpm"]) => {
      setBpm(eventData.bpm);
    };

    tracker.emitter.on("changedBpm", handleBpmChange);

    return () => {
      tracker.emitter.off("changedBpm", handleBpmChange);
    };
  }, []);

  const updateBpm = (newBpm: number) => {
    tracker.setBpm(newBpm);
  };

  return [bpm, updateBpm];
}
