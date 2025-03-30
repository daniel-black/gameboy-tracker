import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { useEffect, useState } from "react";
import { NoteCombobox } from "./note-combobox";
import { Note } from "@/audio/notes";
import { isWaveVolumeLevel, WaveVolumeLevel } from "@/audio/volume";
import { Input } from "./ui/input";
import { WaveFormCombobox } from "./wave-form-combobox";
import { WaveForm } from "@/audio/cell";
import { useCurrentPatternId } from "@/hooks/use-current-pattern-id";
import { VolumeInput } from "./volume-input";

export function WaveCell(props: { row: number }) {
  const [currentPatternId] = useCurrentPatternId();
  const [cell, setCell] = useState(tracker.getWaveCell(props.row));

  useEffect(() => {
    const handleChangedWaveCell = (
      eventData: TrackerEventMap["changedWaveCell"]
    ) => {
      if (eventData.row === props.row) {
        setCell(tracker.getWaveCell(eventData.row));
      }
    };
    const handleChangedCurrentPatternEvent = (
      _: TrackerEventMap["changedCurrentPattern"]
    ) => {
      setCell(tracker.getWaveCell(props.row));
    };

    tracker.emitter.on("changedWaveCell", handleChangedWaveCell);
    tracker.emitter.on(
      "changedCurrentPattern",
      handleChangedCurrentPatternEvent
    );

    return () => {
      tracker.emitter.off("changedWaveCell", handleChangedWaveCell);
      tracker.emitter.off(
        "changedCurrentPattern",
        handleChangedCurrentPatternEvent
      );
    };
  }, []);

  function handleNoteChange(newNote: string) {
    if (newNote.length > 3) return;
    const newCell = { ...cell, note: newNote.toUpperCase() as Note };
    tracker.setWaveCell(props.row, newCell);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    let inputValue = parseFloat(e.target.value);

    if (inputValue === 0.75) {
      // volume increasing
      if (cell.volume === 0.5) {
        inputValue = 1;
      }
      // volume decreasing
      else if (cell.volume === 1) {
        inputValue = 0.5;
      }
    }

    if (isWaveVolumeLevel(inputValue)) {
      tracker.setWaveCell(props.row, { ...cell, volume: inputValue });
    } else {
      console.error(`Invalid volume level: ${inputValue}`);
    }

    // if (isNaN(parsedVolume) || parsedVolume < 0 || parsedVolume > 1) return;
    // const newCell = { ...cell, volume: parsedVolume as WaveVolumeLevel };
    // tracker.setWaveCell(props.row, newCell);
  }

  function handleWaveFormChange(newWaveForm: WaveForm) {
    const newCell = { ...cell, waveForm: newWaveForm };
    tracker.setWaveCell(props.row, newCell);
  }

  return (
    <div
      className="border p-1 h-8 hover:bg-slate-100 flex items-center gap-1"
      key={`${currentPatternId}-wave-${props.row}`}
    >
      <NoteCombobox note={cell.note} handleNoteChange={handleNoteChange} />

      <WaveFormCombobox
        waveForm={cell.waveForm}
        handleWaveFormChange={handleWaveFormChange}
      />

      <VolumeInput
        volume={cell.volume}
        handleVolumeChange={handleVolumeChange}
        max={1}
        step={0.25}
      />
    </div>
  );
}
