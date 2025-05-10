import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { WaveForm } from "./wave-form";

export function WaveFormRadioGroup() {
  return (
    <RadioGroup value={"sine"} className="flex gap-2">
      <div className="flex items-center space-x-2 border p-2 rounded-sm">
        <RadioGroupItem value="SIN" id="radio-sine" className="peer" />
        <Label
          htmlFor="radio-sine"
          className="flex flex-col peer-has-checked:bg-green-500"
        >
          <WaveForm waveForm="sine" />
          <span className="text-xs">Sine</span>
        </Label>
      </div>
      <div className="flex items-center space-x-2 border p-2 rounded-sm">
        <RadioGroupItem value="SQR" id="radio-square" className="peer" />
        <Label
          htmlFor="radio-square"
          className="flex flex-col peer-checked:bg-green-500"
        >
          <WaveForm waveForm="square" />
          <span className="text-xs">Square</span>
        </Label>
      </div>
      <div className="flex items-center space-x-2 border p-2 rounded-sm">
        <RadioGroupItem value="SAW" id="radio-sawtooth" />
        <Label htmlFor="radio-sawtooth" className="flex flex-col">
          <WaveForm waveForm="sawtooth" />
          <span className="text-xs">Sawtooth</span>
        </Label>
      </div>
      <div className="flex items-center space-x-2 border p-2 rounded-sm">
        <RadioGroupItem value="TRI" id="radio-triangle" />
        <Label htmlFor="radio-triangle" className="flex flex-col">
          <WaveForm waveForm="triangle" />
          <span className="text-xs">Triangle</span>
        </Label>
      </div>
    </RadioGroup>
  );
}
