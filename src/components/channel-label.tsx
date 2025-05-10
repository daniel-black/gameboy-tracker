import { ChannelIndex } from "@/audio/types";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useChannel } from "@/hooks/use-channel";
import { getChannelName } from "@/lib/config";

export function ChannelLabel({ channelIndex }: { channelIndex: ChannelIndex }) {
  const toggleId = `${channelIndex}-toggle`;
  const { isChannelEnabled, toggleChannel } = useChannel(channelIndex);

  return (
    <div className="flex items-center gap-2 w-full">
      <Checkbox
        id={toggleId}
        checked={isChannelEnabled}
        onCheckedChange={toggleChannel}
      />
      <Label htmlFor={toggleId} className="text-xs whitespace-nowrap">
        {getChannelName(channelIndex)}
      </Label>
    </div>
  );
}
