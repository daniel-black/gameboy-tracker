import { BPM } from "./bpm";
import { MasterVolume } from "./master-volume";
import { Card, CardContent } from "./ui/card";

export function GlobalControls() {
  return (
    <Card className="py-3 w-full">
      <CardContent className="px-4 flex gap-4">
        <BPM />
        <MasterVolume />
      </CardContent>
    </Card>
  );
}
