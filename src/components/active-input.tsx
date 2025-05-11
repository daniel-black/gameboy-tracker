import { useAtomValue } from "jotai";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { activeStateAtom } from "@/store";
import { useCell } from "@/hooks/use-cell";
import { ChannelIndex } from "@/audio/types";
import { channelConfig, getChannelName } from "@/lib/config";
import { Input } from "./ui/input";

export function ActiveInput() {
  // activeState is updating correctly
  const { active, inputIndex } = useAtomValue(activeStateAtom);

  const [cell, _] = useCell({
    row: active.row ?? 0,
    col: (active.col as ChannelIndex) ?? 0,
  });

  if (active.col === null || inputIndex === null) {
    return <div>please focus an input</div>;
  }

  const input = channelConfig[active.col as ChannelIndex].inputs[inputIndex];

  return (
    <Card
      key={`${active.col}-${active.row}-${inputIndex}`}
      className="p-2 w-full"
    >
      <CardHeader>
        <CardTitle>{input.name} input</CardTitle>
        <CardContent>
          <div className="flex flex-col gap-2">
            <span>
              {getChannelName(active.col as ChannelIndex)} x Row #{active.row}
            </span>

            <p className="mt-3">Value:</p>
            <Input type="text" value={cell[input.name]} readOnly />

            <p className="mt-3">Description:</p>
            <p className="text-xs text-muted-foreground">{input.description}</p>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
