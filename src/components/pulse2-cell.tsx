import React, { useEffect, useState } from "react";
import { tracker } from "../audio/tracker";
import { Note } from "../audio/notes";
import { isVolumeLevel } from "../audio/volume";
import { DutyCycle } from "../audio/wave-shaper";
import { TrackerEventMap } from "../audio/events";
import { DutyCycleCombobox } from "./duty-cycle-combobox";
import { NoteCombobox } from "./note-combobox";
import { useCurrentPatternId } from "@/hooks/use-current-pattern-id";
import { VolumeInput } from "./volume-input";

export function Pulse2Cell(props: { row: number }) {
  const [currentPatternId] = useCurrentPatternId();
  const [cell, setCell] = useState(tracker.getPulse2Cell(props.row));

  useEffect(() => {
    const handleChangedPulse2Cell = (
      eventData: TrackerEventMap["changedPulse2Cell"]
    ) => {
      if (eventData.row === props.row) {
        setCell(tracker.getPulse2Cell(eventData.row));
      }
    };
    const handleChangedCurrentPatternEvent = (
      _: TrackerEventMap["changedCurrentPattern"]
    ) => {
      setCell(tracker.getPulse2Cell(props.row));
    };

    tracker.emitter.on("changedPulse2Cell", handleChangedPulse2Cell);
    tracker.emitter.on(
      "changedCurrentPattern",
      handleChangedCurrentPatternEvent
    );

    return () => {
      tracker.emitter.off("changedPulse2Cell", handleChangedPulse2Cell);
      tracker.emitter.off(
        "changedCurrentPattern",
        handleChangedCurrentPatternEvent
      );
    };
  }, []);

  function handleNoteChange(newNote: string) {
    if (newNote.length > 3) return;
    const newCell = { ...cell, note: newNote.toUpperCase() as Note };
    tracker.setPulse2Cell(props.row, newCell);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = parseInt(e.target.value, 10);
    if (isVolumeLevel(inputValue)) {
      const newCell = { ...cell, volume: inputValue };
      tracker.setPulse2Cell(props.row, newCell);
    } else {
      console.error(`Invalid volume level: ${inputValue}`);
    }
  }

  function handleDutyCycleChange(newDutyCycle: DutyCycle) {
    const newCell = { ...cell, dutyCycle: newDutyCycle };
    tracker.setPulse2Cell(props.row, newCell);
  }

  return (
    <div
      className="border p-1 h-8 hover:bg-slate-100 flex items-center gap-1"
      key={`${currentPatternId}-pulse2-${props.row}`}
    >
      <NoteCombobox note={cell.note} handleNoteChange={handleNoteChange} />
      <VolumeInput
        volume={cell.volume}
        handleVolumeChange={handleVolumeChange}
      />
      <DutyCycleCombobox
        dutyCycle={cell.dutyCycle}
        handleDutyCycleChange={handleDutyCycleChange}
      />
    </div>
  );
}
