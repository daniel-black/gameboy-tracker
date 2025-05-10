import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useCell } from "@/hooks/use-cell";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { WaveFormRadioGroup } from "./wave-form-radio-group";

export function WaveExpanded({ row }: { row: number }) {
  const [cell, _] = useCell({ row, col: 2 });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Wave - Row {row}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label>Note</Label>
          <Input value={cell.note} readOnly />
          <p className="text-xs text-muted-foreground">
            Enter a valid note input like C-4 or G#5. Use --- to continue or OFF
            to turn the note off
          </p>
        </div>
        <div className="space-y-1">
          <Label>Volume</Label>
          <Input value={cell.volume} readOnly />
          <p className="text-xs text-muted-foreground">
            Enter one of the following volume levels: LO, MD, HI, OF (off), or
            -- (continue)
          </p>
        </div>
        <WaveFormRadioGroup />
        <div className="space-y-1">
          <Label>Wave Form</Label>
          <Input value={cell.waveForm} readOnly />
          <p className="text-xs text-muted-foreground">
            Enter a valid wave form or --- to continue the previous wave form
          </p>
          <ul className="text-xs text-muted-foreground">
            <li>TRI = triangle</li>
            <li>SAW = sawtooth</li>
            <li>SQR = square</li>
            <li>SIN = sine</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
