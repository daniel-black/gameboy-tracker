import { useEffect, useState } from "react";
import { ChannelType } from "../audio/channels";
import { tracker, TrackerEventMap } from "../audio/tracker";

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
    <div>
      <input
        type="checkbox"
        id={props.channel}
        checked={isChannelEnabled}
        onChange={handleChannelToggle}
      />
      <label htmlFor={props.channel}>{props.channel}</label>
    </div>
  );
}
