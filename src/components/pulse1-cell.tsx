import React, { useEffect, useState } from "react";
import { tracker, TrackerEventMap } from "../audio/tracker";
import { Note } from "../audio/notes";
import { VolumeLevel } from "../audio/volume";
import { DutyCycle } from "../audio/wave-shaper";

export function Pulse1Cell(props: { row: number }) {
  const [cell, setCell] = useState(tracker.getPulse1Cell(props.row));

  useEffect(() => {
    const handleChangedPulse1Cell = (
      eventData: TrackerEventMap["changedPulse1Cell"]
    ) => {
      if (eventData.row === props.row) {
        setCell(tracker.getPulse1Cell(eventData.row));
      }
    };
    const handleChangedCurrentPatternEvent = (
      _: TrackerEventMap["changedCurrentPattern"]
    ) => {
      setCell(tracker.getPulse1Cell(props.row));
    };

    tracker.emitter.on("changedPulse1Cell", handleChangedPulse1Cell);
    tracker.emitter.on(
      "changedCurrentPattern",
      handleChangedCurrentPatternEvent
    );

    return () => {
      tracker.emitter.off("changedPulse1Cell", handleChangedPulse1Cell);
      tracker.emitter.off(
        "changedCurrentPattern",
        handleChangedCurrentPatternEvent
      );
    };
  }, []);

  function handleNoteChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 3) return;
    const newCell = { ...cell, note: e.target.value.toUpperCase() as Note };
    tracker.setPulse1Cell(props.row, newCell);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parsedVolume = parseInt(e.target.value, 10);
    if (isNaN(parsedVolume) || parsedVolume < 0 || parsedVolume > 15) return;
    const newCell = { ...cell, volume: parsedVolume as VolumeLevel };
    tracker.setPulse1Cell(props.row, newCell);
  }

  function handleDutyCycleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parsedDutyCycle = parseFloat(e.target.value);
    if (isNaN(parsedDutyCycle) || parsedDutyCycle < 0 || parsedDutyCycle > 1)
      return;
    const newCell = { ...cell, dutyCycle: parsedDutyCycle as DutyCycle };
    tracker.setPulse1Cell(props.row, newCell);
  }

  return (
    <div className="border py-0.5 px-2 hover:bg-slate-100">
      n:
      <input
        type="text"
        value={cell.note}
        onChange={handleNoteChange}
        className="w-12"
      />
      v:
      <input
        type="number"
        min={0}
        max={15}
        value={cell.volume}
        onChange={handleVolumeChange}
      />
      dc
      <input
        type="number"
        min={0}
        value={cell.dutyCycle}
        onChange={handleDutyCycleChange}
        className="w-18"
      />
    </div>
  );
}
