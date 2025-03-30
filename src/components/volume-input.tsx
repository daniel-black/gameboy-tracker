import { VolumeLevel, WaveVolumeLevel } from "@/audio/volume";
import { Input } from "./ui/input";

type VolumeInputProps = {
  volume: VolumeLevel | WaveVolumeLevel;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  max?: number;
  step?: number;
};

export function VolumeInput({
  volume,
  handleVolumeChange,
  max = 15,
  step = 1,
}: VolumeInputProps) {
  return (
    <Input
      type="number"
      min={0}
      max={max}
      value={volume}
      step={step}
      onChange={handleVolumeChange}
      className="text-xs md:text-xs focus-visible:ring-[1px] px-1.5 py-1 h-6 rounded-sm"
    />
  );
}
