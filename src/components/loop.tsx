import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useLooping } from "@/hooks/use-looping";

export function Loop() {
  const [isLooping, toggleLooping] = useLooping();

  return (
    <div>
      <Label htmlFor="loop-control">
        <Checkbox
          id="loop-control"
          checked={isLooping}
          onCheckedChange={toggleLooping}
        />
        <span>Loop</span>
      </Label>
    </div>
  );
}
