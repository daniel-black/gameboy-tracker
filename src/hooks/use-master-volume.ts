import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { useEffect, useState } from "react";

export function useMasterVolume() {
  const [masterVolume, setMasterVolume] = useState(tracker.getMasterVolume());

  useEffect(() => {
    const onMasterVolumeChanged = (
      eventData: TrackerEventMap["changedMasterVolume"]
    ) => {
      setMasterVolume(eventData.volume);
    };

    tracker.emitter.on("changedMasterVolume", onMasterVolumeChanged);

    return () => {
      tracker.emitter.off("changedMasterVolume", onMasterVolumeChanged);
    };
  }, []);

  function updateMasterVolume(volume: number) {
    tracker.setMasterVolume(volume);
  }

  return [masterVolume, updateMasterVolume] as const;
}
