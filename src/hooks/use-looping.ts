import { useState, useEffect } from "react";
import { tracker } from "@/audio/tracker";
import { TrackerEventMap } from "@/audio/events";

/**
 * Hook to manage the looping state in the tracker
 * @returns A tuple containing [isLooping, toggleLooping]
 */
export const useLooping = (): [boolean, () => void] => {
  const [isLooping, setIsLooping] = useState(tracker.getLooping());

  useEffect(() => {
    const handleChangedLooping = (
      eventData: TrackerEventMap["changedLooping"]
    ) => {
      setIsLooping(eventData.isLooping);
    };

    tracker.emitter.on("changedLooping", handleChangedLooping);

    return () => {
      tracker.emitter.off("changedLooping", handleChangedLooping);
    };
  }, []);

  const toggleLooping = () => {
    const newLoopingState = !isLooping;
    tracker.setLooping(newLoopingState);
  };

  return [isLooping, toggleLooping];
};
