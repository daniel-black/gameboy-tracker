import React, { useEffect, useState } from "react";
import { tracker } from "../audio/tracker";
import { Note } from "../audio/notes";
import { VolumeLevel } from "../audio/volume";
import { DutyCycle } from "../audio/wave-shaper";
import { TrackerEventMap } from "../audio/events";
import { Input } from "./ui/input";
import { NoteCombobox } from "./note-combobox";
import { DutyCycleCombobox } from "./duty-cycle-combobox";

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

  function handleNoteChange(newNote: string) {
    if (newNote.length > 3) return;
    const newCell = { ...cell, note: newNote.toUpperCase() as Note };
    tracker.setPulse1Cell(props.row, newCell);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parsedVolume = parseInt(e.target.value, 10);
    if (isNaN(parsedVolume) || parsedVolume < 0 || parsedVolume > 15) return;
    const newCell = { ...cell, volume: parsedVolume as VolumeLevel };
    tracker.setPulse1Cell(props.row, newCell);
  }

  function handleDutyCycleChange(newDutyCycle: DutyCycle) {
    const newCell = { ...cell, dutyCycle: newDutyCycle };
    tracker.setPulse1Cell(props.row, newCell);
  }

  return (
    <div className="border py-0.5 px-3 h-12 hover:bg-slate-100 flex items-center gap-4">
      <NoteCombobox note={cell.note} handleNoteChange={handleNoteChange} />
      <Input
        type="number"
        min={0}
        max={15}
        value={cell.volume}
        onChange={handleVolumeChange}
        className="w-16"
      />
      <DutyCycleCombobox
        dutyCycle={cell.dutyCycle}
        handleDutyCycleChange={handleDutyCycleChange}
      />
    </div>
  );
}
