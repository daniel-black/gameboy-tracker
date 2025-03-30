import React, { useEffect, useState } from "react";
import { tracker } from "../audio/tracker";
import { Note } from "../audio/notes";
import { isVolumeLevel } from "../audio/volume";
import { DutyCycle } from "../audio/wave-shaper";
import { TrackerEventMap } from "../audio/events";
import { NoteCombobox } from "./note-combobox";
import { DutyCycleCombobox } from "./duty-cycle-combobox";
import { useCurrentPatternId } from "@/hooks/use-current-pattern-id";
import { VolumeInput } from "./volume-input";

export function Pulse1Cell(props: { row: number }) {
  const [cell, setCell] = useState(tracker.getPulse1Cell(props.row));
  const [currentPatternId] = useCurrentPatternId();

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

  function handleNoteChange(newNote: string) {
    if (newNote.length > 3) return;
    const newCell = { ...cell, note: newNote.toUpperCase() as Note };
    tracker.setPulse1Cell(props.row, newCell);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = parseInt(e.target.value, 10);
    if (isVolumeLevel(inputValue)) {
      const newCell = { ...cell, volume: inputValue };
      tracker.setPulse1Cell(props.row, newCell);
    } else {
      console.error(`Invalid volume level: ${inputValue}`);
    }
  }

  function handleDutyCycleChange(newDutyCycle: DutyCycle) {
    const newCell = { ...cell, dutyCycle: newDutyCycle };
    tracker.setPulse1Cell(props.row, newCell);
  }

  return (
    <div
      className="border p-1 h-8 hover:bg-slate-100 flex items-center gap-1"
      key={`pattern-${currentPatternId}-pulse1-${props.row}`}
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
