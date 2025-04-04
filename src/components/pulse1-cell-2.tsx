import { usePulse1Cell } from "@/hooks/use-pulse1-cell";
import { activeCellAtom } from "@/store";
import { useSetAtom } from "jotai";
import { NoteInput } from "./note-input";

const validVolumeValues = [
  "--",
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
];

const validDutyCycleValues = ["--", "12", "25", "50", "75"];

export function Pulse1Cell2(props: { row: number }) {
  const [cell, setCell] = usePulse1Cell(props.row);
  const setActiveCell = useSetAtom(activeCellAtom);

  function setPreviousCellAsActive() {
    setTimeout(() => {
      setActiveCell({ row: props.row > 0 ? props.row - 1 : 0, col: 3 });
    }, 0);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Prevent more than 2 characters
    if (e.target.value.length > 2) return;

    // Only allow numbers and '-' characters
    if (!/^[0-9-]*$/.test(e.target.value)) {
      return;
    }

    let newInput = e.target.value;

    if (newInput === "-") {
      setCell({ ...cell, volume: "--" });
      return;
    }

    // Check for valid input during typing
    const validDuringTyping =
      newInput === "" ||
      /^[0-9]$/.test(newInput) ||
      validVolumeValues.includes(newInput);

    if (validDuringTyping) {
      setCell({ ...cell, volume: newInput });
      return;
    }
  }

  function handleVolumeKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (cell.volume === "--") {
        e.preventDefault();

        setCell({ ...cell, volume: "" });
        return;
      }
    }

    if (e.key === "-" && cell.volume.length === 2) {
      setCell({ ...cell, volume: "--" });
      return;
    }
  }

  function handleVolumeBlur() {
    if (cell.volume.length === 1 && /^[0-9]$/.test(cell.volume[0])) {
      setCell({ ...cell, volume: `0${cell.volume}` });
      return;
    }

    if (cell.volume.length !== 2) {
      setCell({ ...cell, volume: "--" });
    }
  }

  function handleDutyCycleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 2) return;

    const input = e.target.value;

    if (input === "-") {
      setCell({ ...cell, dutyCycle: "--" });
    } else if (input === "1") {
      setCell({ ...cell, dutyCycle: "12" });
    } else if (input === "2") {
      setCell({ ...cell, dutyCycle: "25" });
    } else if (input === "5") {
      setCell({ ...cell, dutyCycle: "50" });
    } else if (input === "7") {
      setCell({ ...cell, dutyCycle: "75" });
    } else if (input.length === 2 && validDutyCycleValues.includes(input)) {
      setCell({ ...cell, dutyCycle: input });
    }
  }

  function handleDutyCycleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();

      setCell({ ...cell, dutyCycle: "" });
      return;
    }

    if (e.key === "Tab" && !e.shiftKey) {
      // Let the default tab behavior work, but update the active cell
      setTimeout(() => {
        setActiveCell({ row: props.row, col: 1 });
      }, 0);
    }
  }

  function handleDutyCycleBlur() {
    if (!validDutyCycleValues.includes(cell.dutyCycle)) {
      setCell({ ...cell, dutyCycle: "--" });
    }
  }

  return (
    <>
      {/* Note */}
      <NoteInput
        value={cell.note}
        onChange={(newNote: string) => setCell({ ...cell, note: newNote })}
        setPreviousCellAsActive={setPreviousCellAsActive}
      />

      {/* Volume */}
      <input
        type="text"
        placeholder="⋅⋅"
        maxLength={2}
        className="w-4 focus:outline-0 invalid:bg-red-200"
        // TODO: Add pattern to validate volume input
        value={cell.volume}
        onChange={handleVolumeChange}
        onKeyDown={handleVolumeKeyDown}
        onBlur={handleVolumeBlur}
      />

      {/* Duty cycle */}
      <input
        type="text"
        placeholder="⋅⋅"
        maxLength={2}
        className="w-4 focus:outline-0 invalid:bg-red-200"
        pattern="^(12|25|50|75|--)$"
        value={cell.dutyCycle}
        onChange={handleDutyCycleChange}
        onKeyDown={handleDutyCycleKeyDown}
        onBlur={handleDutyCycleBlur}
      />
    </>
  );
}
