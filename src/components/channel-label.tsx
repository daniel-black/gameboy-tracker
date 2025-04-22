import { ChannelType } from "@/audio/types";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useChannel } from "@/hooks/use-channel";

const channelLabels: Record<ChannelType, string> = {
  pulse1: "Pulse 1",
  pulse2: "Pulse 2",
  wave: "Wave",
  noise: "Noise",
};

export function ChannelLabel(props: { channel: ChannelType }) {
  const toggleId = `${props.channel}-toggle`;
  const { isChannelEnabled, toggleChannel } = useChannel(props.channel);

  return (
    <div className="flex items-center gap-2 w-full">
      <Checkbox
        id={toggleId}
        checked={isChannelEnabled}
        onCheckedChange={toggleChannel}
      />
      <Label htmlFor={toggleId} className="text-xs whitespace-nowrap">
        {channelLabels[props.channel]}
      </Label>
    </div>
  );
}
