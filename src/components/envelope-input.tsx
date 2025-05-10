type EnvelopeInputProps = {
  envelope: string;
  setEnvelope: (newEnvelope: string) => void;
  ref: React.Ref<HTMLInputElement>;
  setFocus: () => void;
};

// Allowed values:
// "--" (continue)
// Strings of length two starting with 0 means decrease
// Strings of length two starting with 1 means increase
// Second char can be 0-7

export function getHandleEnvelopeChange(
  setEnvelope: (newEnvelope: string) => void
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 2) return;

    const input = e.target.value;

    if (input.length === 1) {
      if (input === "-") {
        setEnvelope("--");
        return;
      } else if (input === "0" || input === "1") {
        setEnvelope(input);
        return;
      }
    } else if (input.length === 2) {
      if (input === "--") {
        setEnvelope("--");
        return;
      } else if (input[0] === "0" || input[0] === "1") {
        if (/^[01][0-7]$/.test(input)) {
          setEnvelope(input);
          return;
        }
      }
    }
  };
}

export function getHandleEnvelopeKeyDown(
  envelope: string,
  setEnvelope: (newEnvelope: string) => void
) {
  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-") {
      setEnvelope("--");
      return;
    }

    if (e.key === "Backspace" && envelope === "--") {
      e.preventDefault();
      setEnvelope("");
      return;
    }

    if (envelope.length === 2) {
      if (e.key === "-") {
        setEnvelope("--");
        return;
      }

      if (e.key === "0" || e.key === "1") {
        setEnvelope("");
        return;
      }
    }
  };
}

export function getHandleEnvelopeBlur(
  envelope: string,
  setEnvelope: (newEnvelope: string) => void
) {
  return () => {
    if (envelope.length !== 2) {
      setEnvelope("--");
      return;
    }
  };
}

export function EnvelopeInput({
  envelope,
  setEnvelope,
  ref,
  setFocus,
}: EnvelopeInputProps) {
  function handleEnvelopeChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 2) return;

    const input = e.target.value;

    if (input.length === 1) {
      if (input === "-") {
        setEnvelope("--");
        return;
      } else if (input === "0" || input === "1") {
        setEnvelope(input);
        return;
      }
    } else if (input.length === 2) {
      if (input === "--") {
        setEnvelope("--");
        return;
      } else if (input[0] === "0" || input[0] === "1") {
        if (/^[01][0-7]$/.test(input)) {
          setEnvelope(input);
          return;
        }
      }
    }
  }

  function handleEnvelopeKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "-") {
      setEnvelope("--");
      return;
    }

    if (e.key === "Backspace" && envelope === "--") {
      e.preventDefault();
      setEnvelope("");
      return;
    }

    if (envelope.length === 2) {
      if (e.key === "-") {
        setEnvelope("--");
        return;
      }

      if (e.key === "0" || e.key === "1") {
        setEnvelope("");
        return;
      }
    }
  }

  function handleEnvelopeBlur() {
    if (envelope.length !== 2) {
      setEnvelope("--");
      return;
    }
  }

  return (
    <input
      ref={ref}
      type="text"
      placeholder="⋅⋅"
      maxLength={2}
      data-continue={envelope === "--"}
      className="w-4 focus:outline-0 invalid:bg-red-200 data-[continue=true]:text-muted-foreground"
      value={envelope}
      onChange={handleEnvelopeChange}
      onKeyDown={handleEnvelopeKeyDown}
      onBlur={handleEnvelopeBlur}
      onFocus={setFocus}
    />
  );
}
