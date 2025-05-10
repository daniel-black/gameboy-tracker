import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { ChannelIndex } from "@/audio/types";
import { useCallback, useEffect, useState } from "react";

export function useChannel(channelIndex: ChannelIndex) {
  const [isChannelEnabled, setIsChannelEnabled] = useState(
    tracker.getIsChannelEnabled(channelIndex)
  );

  useEffect(() => {
    const handleToggledChannelEvent = (
      eventData: TrackerEventMap["toggledChannel"]
    ) => {
      if (eventData.channelIndex === channelIndex) {
        setIsChannelEnabled(eventData.enabled);
      }
    };

    tracker.emitter.on("toggledChannel", handleToggledChannelEvent);

    return () => {
      tracker.emitter.off("toggledChannel", handleToggledChannelEvent);
    };
  }, []);

  function toggleChannel(): void {
    tracker.toggleChannel(channelIndex);
  }

  const spotlightChannel = useCallback(
    (): void => tracker.spotlightChannel(channelIndex),
    [channelIndex]
  );

  return {
    isChannelEnabled,
    toggleChannel,
    spotlightChannel,
  } as const;
}
