import { ChannelIndex } from "@/audio/types";
import { useChannel } from "@/hooks/use-channel";
import { getChannelName } from "@/lib/config";
import { ConeIcon, EarIcon, EarOffIcon } from "lucide-react";
import { memo } from "react";

export const ChannelHeader = memo(function ChannelHeader({
  index,
}: {
  index: ChannelIndex;
}) {
  const { isChannelEnabled, toggleChannel, spotlightChannel } =
    useChannel(index);

  return (
    <th
      scope="col"
      className="border focus-within:inset-ring-1 focus-within:inset-ring-blue-200 focus-within:z-50"
    >
      <div className="flex items-center">
        <button
          className="px-2 focus:outline-none flex items-center gap-1 group"
          onClick={toggleChannel}
        >
          {isChannelEnabled ? (
            <EarIcon className="size-3 group-focus:bg-blue-200 rounded-full" />
          ) : (
            <EarOffIcon className="size-3 group-focus:bg-blue-200 rounded-full" />
          )}
          <span className="text-sm">{getChannelName(index)}</span>
        </button>

        <button
          className="focus:outline-none px-2 group"
          onClick={(e) => {
            e.stopPropagation();
            spotlightChannel();
          }}
        >
          <ConeIcon className="size-3 group-focus:bg-blue-200 rounded-full" />
        </button>
      </div>
    </th>
  );
});
