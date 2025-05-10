import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useCell } from "@/hooks/use-cell";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function NoiseExpanded({ row }: { row: number }) {
  const [cell, _] = useCell({ row, col: 3 });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Noise - Row {row}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label>Rate</Label>
          <Input value={cell.rate} readOnly />
          <p className="text-xs text-muted-foreground">
            Enter a valid playback rate. Inputs like XX map to X.X. For example,
            10 maps to 1.0 or 1x the playback rate. Range is 00 (0.0x) to 99
            (9.9x)
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
      </CardContent>
    </Card>
  );
}
