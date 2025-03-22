import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { ChannelType } from "@/audio/types";
import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";

export function ChannelToggle(props: { channel: ChannelType }) {
  const [isChannelEnabled, setIsChannelEnabled] = useState(
    tracker.getIsChannelEnabled(props.channel)
  );

  useEffect(() => {
    const handleToggledChannelEvent = (
      eventData: TrackerEventMap["toggledChannel"]
    ) => {
      if (eventData.channel === props.channel) {
        setIsChannelEnabled(eventData.enabled);
      }
    };

    tracker.emitter.on("toggledChannel", handleToggledChannelEvent);

    return () => {
      tracker.emitter.off("toggledChannel", handleToggledChannelEvent);
    };
  }, []);

  function handleChannelToggle() {
    tracker.toggleChannel(props.channel);
  }

  return (
    <Checkbox
      checked={isChannelEnabled}
      onCheckedChange={handleChannelToggle}
    />
  );
}
