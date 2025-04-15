import { useMasterVolume } from "@/hooks/use-master-volume";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

export function MasterVolume() {
  // master volume is between 0 and 1
  const [masterVolume, updateMasterVolume] = useMasterVolume();

  function handleVolumeChange(e: Array<number>) {
    e[0] && updateMasterVolume(e[0]);
  }

  return (
    <div className="space-y-2 w-32">
      <div className="flex justify-between">
        <Label htmlFor="master-volume">Vol.</Label>
        <span className="text-sm">{Math.trunc(masterVolume * 100)}%</span>
      </div>
      <Slider
        id="master-volume"
        defaultValue={[masterVolume]}
        min={-0.01} // confused about this
        max={1}
        step={0.01}
        onValueChange={handleVolumeChange}
      />
    </div>
  );
}
