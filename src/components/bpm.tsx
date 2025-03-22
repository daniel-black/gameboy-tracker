import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useBpm } from "@/hooks/use-bpm";

export function BPM() {
  const [bpm, updateBpm] = useBpm();

  function handleBPMChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newBPM = parseInt(event.target.value, 10);
    updateBpm(newBPM);
  }

  return (
    <div>
      <Label htmlFor="bpm-control">
        <span>BPM</span>
        <Input
          id="bpm-control"
          type="number"
          min={40}
          max={240}
          value={bpm}
          onChange={handleBPMChange}
          className="w-20"
        />
      </Label>
    </div>
  );
}
