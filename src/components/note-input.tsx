// Valid first characters (note names and special characters)
const validFirstChars = ["C", "D", "E", "F", "G", "A", "B", "O", "-"];

const validNoteChars = ["C", "D", "E", "F", "G", "A", "B"];

// Valid second characters ("F" might be one too but)
const validSecondChars = ["-", "#"];

// Valid third characters (octave numbers)
const validThirdChars = ["2", "3", "4", "5", "6", "7", "F"];

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
    // Prevent more than 3 characters
    if (e.target.value.length > 3) return;

    // Always work with uppercase
    const input = e.target.value.toUpperCase();

    // Shortcut for "---" from empty
    if (note === "" && input === "-") {
      setNote("---");
      return;
    }

    // Shortcut for "OFF" from empty
    if (note === "" && input === "O") {
      setNote("OFF");
      return;
    }

    let isValid = true;

    if (input.length === 1) {
      // First character must be a valid note or special character
      isValid = validFirstChars.includes(input);
    } else if (input.length === 2) {
      const firstChar = input[0];
      const secondChar = input[1];

      // Special case for OFF
      if (input === "OF") {
        isValid = true;
      } else if (validNoteChars.includes(firstChar)) {
        isValid = validSecondChars.includes(secondChar);
      } else {
        isValid = false;
      }
    } else if (input.length === 3) {
      const firstChar = input[0];
      const secondChar = input[1];
      const thirdChar = input[2];

      // Special cases
      if (input === "OFF" || input === "---") {
        isValid = true;
      } else if (
        validNoteChars.includes(firstChar) &&
        validSecondChars.includes(secondChar)
      ) {
        isValid = validThirdChars.includes(thirdChar);
      } else {
        isValid = false;
      }
    }

    if (isValid) {
      setNote(input);
    }
  }

  function handleNoteKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Backspace on a special note should fully clear the input
    if (e.key === "Backspace") {
      if (note === "---" || note === "OFF") {
        e.preventDefault();
        setNote("");
        return;
      }
    }

    // Start of a valid note should clear out special notes
    if (validNoteChars.includes(e.key.toUpperCase())) {
      if (note === "---" || note === "OFF") {
        e.preventDefault();
        setNote(e.key.toUpperCase());
        return;
      }
    }

    // Entering "-" when a valid note is entered should set it to "---"
    if (e.key === "-" && note.length === 3) {
      setNote("---");
      return;
    }

    // Entering "O" when a valid note is entered should set it to "OFF"
    if (e.key === "o" && note.length === 3) {
      setNote("OFF");
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
      setNote("---");
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
