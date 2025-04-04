type NoteInputProps = {
  value: string;
  onChange: (value: string) => void;
  setPreviousCellAsActive: () => void;
};

// Valid first characters (note names and special characters)
const validFirstChars = ["C", "D", "E", "F", "G", "A", "B", "O", "-"];

const validNoteChars = ["C", "D", "E", "F", "G", "A", "B"];

// Valid second characters ("F" might be one too but)
const validSecondChars = ["-", "#"];

// Valid third characters (octave numbers)
const validThirdChars = ["2", "3", "4", "5", "6", "7", "F"];

export function NoteInput(props: NoteInputProps) {
  function handleNoteChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Prevent more than 3 characters
    if (e.target.value.length > 3) return;

    // Always work with uppercase
    const input = e.target.value.toUpperCase();

    // Shortcut for "---" from empty
    if (props.value === "" && input === "-") {
      props.onChange("---");
      return;
    }

    // Shortcut for "OFF" from empty
    if (props.value === "" && input === "O") {
      props.onChange("OFF");
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
      props.onChange(input);
    }
  }

  function handleNoteKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (props.value === "---" || props.value === "OFF") {
        e.preventDefault();

        props.onChange("");
        return;
      }
    }

    if (e.key === "-" && props.value.length === 3) {
      props.onChange("---");
      return;
    }

    if (e.key === "o" && props.value.length === 3) {
      props.onChange("OFF");
      return;
    }

    if (e.key === "Tab" && e.shiftKey) {
      props.setPreviousCellAsActive();
      return;
    }
  }

  function handleNoteBlur() {
    if (props.value.length !== 3) {
      props.onChange("---");
    }
  }

  return (
    <input
      type="text"
      maxLength={3}
      placeholder="⋅⋅⋅"
      className="w-6 focus:outline-0 invalid:bg-red-200"
      value={props.value}
      onChange={handleNoteChange}
      onKeyDown={handleNoteKeyDown}
      onBlur={handleNoteBlur}
    />
  );
}
