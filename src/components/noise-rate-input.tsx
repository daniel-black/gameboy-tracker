type NoiseRateInputProps = {
  rate: string;
  setRate: (newRate: string) => void;
  ref: React.Ref<HTMLInputElement>;
  setFocus: () => void;
};

const numberStrings = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// `rate` is a string. It can only be 2 characters long.
// It can be "--" (continue) or a two digit number string from "00" to "99"

export function NoiseRateInput({
  rate,
  setRate,
  ref,
  setFocus,
}: NoiseRateInputProps) {
  function handleRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 2) return;

    if (e.target.value === "") {
      setRate("");
      return;
    }

    if (e.target.value.length === 1) {
      if (e.target.value === "-") {
        setRate("--");
      } else if (numberStrings.includes(e.target.value)) {
        setRate(e.target.value);
      }
    } else if (e.target.value.length === 2) {
      if (
        numberStrings.includes(e.target.value[0]) &&
        numberStrings.includes(e.target.value[1])
      ) {
        setRate(e.target.value);
      } else if (e.target.value === "--") {
        setRate("--");
      }
    }
  }

  function handleRateKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "-") {
      setRate("--");
      return;
    }

    if (e.key === "Backspace" && rate === "--") {
      e.preventDefault();
      setRate("");
      return;
    }

    if (numberStrings.includes(e.key) && rate === "--") {
      e.preventDefault();
      setRate(e.key);
      return;
    }
  }

  function handleRateBlur() {
    if (rate.length === 1 && numberStrings.includes(rate)) {
      setRate("0" + rate);
      return;
    }

    if (rate.length !== 2) {
      setRate("--");
      return;
    }
  }

  return (
    <input
      ref={ref}
      type="text"
      placeholder="__"
      data-continue={rate === "--"}
      className="w-[26px] focus:bg-primary focus:outline-0 data-[continue=true]:text-muted-foreground"
      value={rate}
      onChange={handleRateChange}
      onKeyDown={handleRateKeyDown}
      onBlur={handleRateBlur}
      onFocus={setFocus}
    />
  );
}
