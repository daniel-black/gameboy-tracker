const validDutyCycleValues = ["--", "12", "25", "50", "75"];

type DutyCycleInputProps = {
  dutyCycle: string;
  setDutyCycle: (newDutyCycle: string) => void;
  ref: React.Ref<HTMLInputElement>;
  setFocus: () => void;
};

export function DutyCycleInput({
  dutyCycle,
  setDutyCycle,
  ref,
  setFocus,
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

    if (dutyCycle.length === 2) {
      if (e.key === "-") {
        setDutyCycle("--");
      } else if (e.key === "1") {
        setDutyCycle("12");
      } else if (e.key === "2") {
        setDutyCycle("25");
      } else if (e.key === "5") {
        setDutyCycle("50");
      } else if (e.key === "7") {
        setDutyCycle("75");
      }
    }
  }

  function handleDutyCycleBlur() {
    if (!validDutyCycleValues.includes(dutyCycle)) {
      setDutyCycle("--");
    }
  }

  return (
    <input
      ref={ref}
      type="text"
      placeholder="__"
      maxLength={2}
      data-continue={dutyCycle === "--"}
      className="w-[16px] focus:bg-primary focus:outline-0 invalid:bg-red-200 data-[continue=true]:text-muted-foreground"
      pattern="^(12|25|50|75|--)$"
      value={dutyCycle}
      onChange={handleDutyCycleChange}
      onKeyDown={handleDutyCycleKeyDown}
      onBlur={handleDutyCycleBlur}
      onFocus={setFocus}
    />
  );
}
