import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useCell } from "@/hooks/use-cell";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function Pulse2Expanded({ row }: { row: number }) {
  const [cell, _] = useCell({ row, col: 1 });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Pulse Wave 2 - Row {row}</CardTitle>
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
            Enter a volume level between 0 and 15 or -- to continue the previous
            volume setting
          </p>
        </div>
        <div className="space-y-1">
          <Label>Duty Cycle</Label>
          <Input value={cell.dutyCycle} readOnly />
          <p className="text-xs text-muted-foreground">
            Enter a valid duty cycle or -- to continue the previous duty cycle
          </p>
          <ul className="text-xs text-muted-foreground">
            <li>12 = 12.5%</li>
            <li>25 = 25%</li>
            <li>50 = 50%</li>
            <li>75 = 75%</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
