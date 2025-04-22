import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { ChannelType } from "@/audio/types";
import { useCallback, useEffect, useState } from "react";

export function useChannel(channel: ChannelType) {
  const [isChannelEnabled, setIsChannelEnabled] = useState(
    tracker.getIsChannelEnabled(channel)
  );

  useEffect(() => {
    const handleToggledChannelEvent = (
      eventData: TrackerEventMap["toggledChannel"]
    ) => {
      if (eventData.channel === channel) {
        setIsChannelEnabled(eventData.enabled);
      }
    };

    tracker.emitter.on("toggledChannel", handleToggledChannelEvent);

    return () => {
      tracker.emitter.off("toggledChannel", handleToggledChannelEvent);
    };
  }, []);

  function toggleChannel(): void {
    tracker.toggleChannel(channel);
  }

  const spotlightChannel = useCallback(
    (): void => tracker.spotlightChannel(channel),
    [channel]
  );

  return {
    isChannelEnabled,
    toggleChannel,
    spotlightChannel,
  } as const;
}
