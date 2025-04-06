const NOTES = {
  SPECIAL: {
    OFF: "OFF",
    CONTINUE: "---",
  },
  VALID_NOTE_CHARS: new Set(["C", "D", "E", "F", "G", "A", "B"]),
  VALID_FIRST_CHARS: new Set(["C", "D", "E", "F", "G", "A", "B", "O", "-"]),
  VALID_SECOND_CHARS: new Set(["-", "#", "b"]),
  VALID_THIRD_CHARS: new Set(["2", "3", "4", "5", "6", "7", "F"]),
  VALID_SHARP_NOTES: new Set(["C", "D", "F", "G", "A"]), // Notes that can have '#'
  VALID_FLAT_NOTES: new Set(["D", "E", "G", "A", "B"]), // Notes that can have 'b'
} as const;

function isValidNoteInput(input: string): boolean {
  if (
    input.length === 0 ||
    input === NOTES.SPECIAL.CONTINUE ||
    input === NOTES.SPECIAL.OFF
  ) {
    return true;
  }

  if (input.length === 1) {
    return NOTES.VALID_FIRST_CHARS.has(input);
  }

  if (input.length === 2) {
    if (input === "OF") {
      return true;
    }

    // Make sure sharps go with the right notes
    if (input[1] === "#") {
      return NOTES.VALID_SHARP_NOTES.has(input[0]);
    }

    // Make sure flats go with the right notes
    if (input[1] === "b") {
      return NOTES.VALID_FLAT_NOTES.has(input[0]);
    }

    return (
      NOTES.VALID_NOTE_CHARS.has(input[0]) &&
      NOTES.VALID_SECOND_CHARS.has(input[1])
    );
  }

  if (input.length === 3) {
    if (input === NOTES.SPECIAL.CONTINUE || input === NOTES.SPECIAL.OFF) {
      return true;
    }

    // Sharps
    if (input[1] === "#") {
      return (
        NOTES.VALID_SHARP_NOTES.has(input[0]) &&
        NOTES.VALID_THIRD_CHARS.has(input[2])
      );
    }

    // Flats
    if (input[1] === "b") {
      return (
        NOTES.VALID_FLAT_NOTES.has(input[0]) &&
        NOTES.VALID_THIRD_CHARS.has(input[2])
      );
    }

    // Natural notes
    return (
      NOTES.VALID_NOTE_CHARS.has(input[0]) &&
      input[1] === "-" &&
      NOTES.VALID_THIRD_CHARS.has(input[2])
    );
  }

  return false;
}

type NoteInputProps = {
  note: string;
  setNote: (value: string) => void;
  setPreviousCellAsActive: () => void;
};

export function NoteInput({
  note,
  setNote,
  setPreviousCellAsActive,
}: NoteInputProps) {
  function handleNoteChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value.replace(/[^b]/g, (c) => c.toUpperCase());

    if (isValidNoteInput(input)) {
      if (input === "O") {
        setNote(NOTES.SPECIAL.OFF);
      } else if (input === "-") {
        setNote(NOTES.SPECIAL.CONTINUE);
      } else {
        setNote(input);
      }
    }
  }

  function handleNoteKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Backspace on a special note should fully clear the input
    if (e.key === "Backspace") {
      if (note === NOTES.SPECIAL.CONTINUE || note === NOTES.SPECIAL.OFF) {
        e.preventDefault();
        setNote("");
        return;
      }
    }

    // Start of a valid note should clear out special notes
    if (NOTES.VALID_NOTE_CHARS.has(e.key.toUpperCase())) {
      if (note === NOTES.SPECIAL.CONTINUE || note === NOTES.SPECIAL.OFF) {
        e.preventDefault();
        setNote(e.key.toUpperCase());
        return;
      }
    }

    // Entering "-" when a valid note is entered should set it to "---"
    if (e.key === "-" && note.length === 3) {
      setNote(NOTES.SPECIAL.CONTINUE);
      return;
    }

    // Entering "O" when a valid note is entered should set it to "OFF"
    if (e.key === "o" && note.length === 3) {
      setNote(NOTES.SPECIAL.OFF);
      return;
    }

    // Shift + Tab should set the previous cell as active
    if (e.key === "Tab" && e.shiftKey) {
      setPreviousCellAsActive();
      return;
    }
  }

  // The input field should not be left invalid
  function handleNoteBlur() {
    if (note.length !== 3) {
      setNote(NOTES.SPECIAL.CONTINUE);
    }
  }

  return (
    <input
      type="text"
      maxLength={3}
      placeholder="⋅⋅⋅"
      className="w-6 focus:outline-0 invalid:bg-red-200"
      value={note}
      onChange={handleNoteChange}
      onKeyDown={handleNoteKeyDown}
      onBlur={handleNoteBlur}
    />
  );
}
