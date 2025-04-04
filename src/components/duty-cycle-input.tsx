const validDutyCycleValues = ["--", "12", "25", "50", "75"];

type DutyCycleInputProps = {
  dutyCycle: string;
  setDutyCycle: (newDutyCycle: string) => void;
  setNextCellAsActive?: () => void;
};

export function DutyCycleInput({
  dutyCycle,
  setDutyCycle,
  setNextCellAsActive,
}: DutyCycleInputProps) {
  function handleDutyCycleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 2) return;

    const input = e.target.value;

    if (input === "-") {
      setDutyCycle("--");
    } else if (input === "1") {
      setDutyCycle("12");
    } else if (input === "2") {
      setDutyCycle("25");
    } else if (input === "5") {
      setDutyCycle("50");
    } else if (input === "7") {
      setDutyCycle("75");
    } else if (input.length === 2 && validDutyCycleValues.includes(input)) {
      setDutyCycle(input);
    }
  }

  function handleDutyCycleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();

      setDutyCycle("");
      return;
    }

    if (setNextCellAsActive && e.key === "Tab" && !e.shiftKey) {
      setNextCellAsActive();
      return;
    }
  }

  function handleDutyCycleBlur() {
    if (!validDutyCycleValues.includes(dutyCycle)) {
      setDutyCycle("--");
    }
  }

  return (
    <input
      type="text"
      placeholder="⋅⋅"
      maxLength={2}
      className="w-4 focus:outline-0 invalid:bg-red-200"
      pattern="^(12|25|50|75|--)$"
      value={dutyCycle}
      onChange={handleDutyCycleChange}
      onKeyDown={handleDutyCycleKeyDown}
      onBlur={handleDutyCycleBlur}
    />
  );
}
