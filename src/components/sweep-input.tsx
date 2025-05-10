type SweepInputProps = {
  sweep: string;
  setSweep: (newSweep: string) => void;
  ref: React.Ref<HTMLInputElement>;
  setFocus: () => void;
};

const SWEEP = {
  CONTINUE: "---",
  VALID_FIRST_CHARS: new Set(["0", "1"]),
  VALID_SECOND_CHARS: new Set(["1", "2", "3", "4", "5", "6", "7"]),
  VALID_THIRD_CHARS: new Set(["1", "2", "3", "4", "5", "6", "7"]),
};

function isValidSweepInput(input: string): boolean {
  if (input.length === 0 || input === SWEEP.CONTINUE) {
    return true;
  }

  if (input.length === 1) {
    return SWEEP.VALID_FIRST_CHARS.has(input);
  }

  if (input.length === 2) {
    return (
      SWEEP.VALID_FIRST_CHARS.has(input[0]) &&
      SWEEP.VALID_SECOND_CHARS.has(input[1])
    );
  }

  if (input.length === 3) {
    return (
      SWEEP.VALID_FIRST_CHARS.has(input[0]) &&
      SWEEP.VALID_SECOND_CHARS.has(input[1]) &&
      SWEEP.VALID_THIRD_CHARS.has(input[2])
    );
  }

  return false;
}

export function getHandleSweepChange(setSweep: (newSweep: string) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidSweepInput(e.target.value)) {
      setSweep(e.target.value);
    }
  };
}

export function getHandleSweepKeyDown(
  sweep: string,
  setSweep: (newSweep: string) => void
) {
  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle special case: "-" key to set to continue
    if (e.key === "-" && (sweep.length === 3 || sweep.length === 0)) {
      e.preventDefault();
      setSweep(SWEEP.CONTINUE);
      return;
    }

    // Backspace on the continue value should fully clear it
    if (e.key === "Backspace" && sweep === SWEEP.CONTINUE) {
      e.preventDefault();
      setSweep("");
      return;
    }

    // When the user presses "0" or "1" while the value is "---", start a new sweep
    if (sweep === SWEEP.CONTINUE && (e.key === "0" || e.key === "1")) {
      e.preventDefault();
      setSweep(e.key);
      return;
    }
  };
}

export function getHandleSweepBlur(
  sweep: string,
  setSweep: (newSweep: string) => void
) {
  return () => {
    if (sweep.length !== 3) {
      setSweep(SWEEP.CONTINUE);
    }
  };
}

export function SweepInput({
  sweep,
  setSweep,
  ref,
  setFocus,
}: SweepInputProps) {
  function handleSweepChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (isValidSweepInput(e.target.value)) {
      setSweep(e.target.value);
    }
  }

  function handleSweepKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Handle special case: "-" key to set to continue
    if (e.key === "-" && (sweep.length === 3 || sweep.length === 0)) {
      e.preventDefault();
      setSweep(SWEEP.CONTINUE);
      return;
    }

    // Backspace on the continue value should fully clear it
    if (e.key === "Backspace" && sweep === SWEEP.CONTINUE) {
      e.preventDefault();
      setSweep("");
      return;
    }

    // When the user presses "0" or "1" while the value is "---", start a new sweep
    if (sweep === SWEEP.CONTINUE && (e.key === "0" || e.key === "1")) {
      e.preventDefault();
      setSweep(e.key);
      return;
    }
  }

  function handleSweepBlur() {
    if (sweep.length !== 3) {
      setSweep(SWEEP.CONTINUE);
    }
  }

  return (
    <input
      ref={ref}
      type="text"
      placeholder="⋅⋅⋅"
      maxLength={3}
      data-continue={sweep === SWEEP.CONTINUE}
      className="w-6 focus:outline-0 invalid:bg-red-200 data-[continue=true]:text-muted-foreground"
      value={sweep}
      onChange={handleSweepChange}
      onKeyDown={handleSweepKeyDown}
      onBlur={handleSweepBlur}
      onFocus={setFocus}
    />
  );
}
