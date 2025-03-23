import React, { useEffect, useState } from "react";
import { tracker } from "../audio/tracker";
import { Note } from "../audio/notes";
import { VolumeLevel } from "../audio/volume";
import { DutyCycle } from "../audio/wave-shaper";
import { TrackerEventMap } from "../audio/events";
import { DutyCycleCombobox } from "./duty-cycle-combobox";
import { NoteCombobox } from "./note-combobox";
import { Input } from "./ui/input";

export function Pulse2Cell(props: { row: number }) {
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
    const parsedVolume = parseInt(e.target.value, 10);
    if (isNaN(parsedVolume) || parsedVolume < 0 || parsedVolume > 15) return;
    const newCell = { ...cell, volume: parsedVolume as VolumeLevel };
    tracker.setPulse2Cell(props.row, newCell);
  }

  function handleDutyCycleChange(newDutyCycle: DutyCycle) {
    const newCell = { ...cell, dutyCycle: newDutyCycle };
    tracker.setPulse2Cell(props.row, newCell);
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
