import { useAtomValue } from "jotai";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { activeStateAtom } from "@/store";
import { useCell } from "@/hooks/use-cell";
import { ChannelIndex } from "@/audio/types";
import { channelConfig, getChannelName } from "@/lib/config";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function ActivePanel() {
  const { active, inputIndex } = useAtomValue(activeStateAtom);

  const [cell, _] = useCell({
    row: active.row ?? 0,
    col: (active.col as ChannelIndex) ?? 0,
  });

  // Nothing active
  if (active.row === null && active.col === null && inputIndex === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ACTIVE PANEL</CardTitle>
          <CardDescription className="text-sm"></CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click on anything in the editor to get more context.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Active Row
  if (active.row !== null && active.col === null && inputIndex === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ROW #{active.row}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Each row has 4 columns corresponding to the 4 channels, pulse 1,
            pulse 2, wave, and noise.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (inputIndex === null) {
    return <div>hmm this should not be possible i dont think</div>;
  }

  const input = channelConfig[active.col as ChannelIndex].inputs[inputIndex];

  // Active input
  return (
    <Card key={`${active.col}-${active.row}-${inputIndex}`} className=" w-full">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span className="uppercase">{input.name} INPUT</span>
          <span className="text-sm text-muted-foreground">
            {getChannelName(active.col as ChannelIndex)} x Row #{active.row}
          </span>
        </CardTitle>
        <CardContent>
          <div className="flex flex-col gap-2 pt-3">
            <Label>value</Label>
            <Input type="text" value={cell[input.name]} readOnly />

            <p className="mt-3 text-sm">description</p>
            <p className="text-xs text-muted-foreground">{input.description}</p>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
