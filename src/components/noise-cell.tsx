import { tracker } from "@/audio/tracker";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { TrackerEventMap } from "@/audio/events";
import { VolumeLevel } from "@/audio/volume";
import { useCurrentPatternId } from "@/hooks/use-current-pattern-id";

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
    const parsedVolume = parseInt(e.target.value, 10);
    if (isNaN(parsedVolume) || parsedVolume < 0 || parsedVolume > 15) return;
    const newCell = { ...cell, volume: parsedVolume as VolumeLevel };
    tracker.setNoiseCell(props.row, newCell);
  }

  function handleRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parsedRate = parseFloat(e.target.value);
    if (isNaN(parsedRate) || parsedRate < 0 || parsedRate > 10) return;
    const newCell = { ...cell, rate: parsedRate };
    tracker.setNoiseCell(props.row, newCell);
  }

  return (
    <div
      className="border py-0.5 px-3 h-12 hover:bg-slate-100 flex items-center gap-4"
      key={`${currentPatternId}-noise-${props.row}`}
    >
      <Input
        type="number"
        min={-0.1}
        max={10}
        step={0.1}
        value={cell.rate}
        onChange={handleRateChange}
        className="w-16"
      />

      <Input
        type="number"
        min={0}
        max={15}
        value={cell.volume}
        onChange={handleVolumeChange}
        className="w-16"
      />
    </div>
  );
}
