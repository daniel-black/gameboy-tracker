import { tracker } from "@/audio/tracker";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { TrackerEventMap } from "@/audio/events";
import { isVolumeLevel, VolumeLevel } from "@/audio/volume";
import { useCurrentPatternId } from "@/hooks/use-current-pattern-id";
import { VolumeInput } from "./volume-input";

export function NoiseCell(props: { row: number }) {
  const [currentPatternId] = useCurrentPatternId();
  const [cell, setCell] = useState(tracker.getNoiseCell(props.row));

  useEffect(() => {
    const handleChangedNoiseCell = (
      eventData: TrackerEventMap["changedNoiseCell"]
    ) => {
      if (eventData.row === props.row) {
        setCell(tracker.getNoiseCell(eventData.row));
      }
    };
    const handleChangedCurrentPatternEvent = (
      _: TrackerEventMap["changedCurrentPattern"]
    ) => {
      setCell(tracker.getNoiseCell(props.row));
    };

    tracker.emitter.on("changedNoiseCell", handleChangedNoiseCell);
    tracker.emitter.on(
      "changedCurrentPattern",
      handleChangedCurrentPatternEvent
    );

    return () => {
      tracker.emitter.off("changedNoiseCell", handleChangedNoiseCell);
      tracker.emitter.off(
        "changedCurrentPattern",
        handleChangedCurrentPatternEvent
      );
    };
  }, []);

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = parseInt(e.target.value, 10);
    if (isVolumeLevel(inputValue)) {
      const newCell = { ...cell, volume: inputValue };
      tracker.setNoiseCell(props.row, newCell);
    } else {
      console.error(`Invalid volume level: ${inputValue}`);
    }
  }

  function handleRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parsedRate = parseFloat(e.target.value);
    if (isNaN(parsedRate) || parsedRate < 0 || parsedRate > 10) return;
    const newCell = { ...cell, rate: parsedRate };
    tracker.setNoiseCell(props.row, newCell);
  }

  return (
    <div
      className="border p-1 h-8 hover:bg-slate-100 flex items-center gap-1"
      key={`${currentPatternId}-noise-${props.row}`}
    >
      <Input
        type="number"
        min={-0.1}
        max={10}
        step={0.1}
        value={cell.rate}
        onChange={handleRateChange}
        className="min-w-14 h-6 text-xs md:text-xs focus-visible:ring-[1px] px-1.5 py-1 rounded-sm"
      />

      <VolumeInput
        volume={cell.volume}
        handleVolumeChange={handleVolumeChange}
      />
    </div>
  );
}
