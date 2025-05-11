type WaveFormInputProps = {
  waveForm: string;
  setWaveForm: (newWaveForm: string) => void;
  ref: React.Ref<HTMLInputElement>;
  setFocus: () => void;
};

const validWaveForms = ["---", "SIN", "SQR", "SAW", "TRI"];

export function WaveFormInput({
  waveForm,
  setWaveForm,
  ref,
  setFocus,
}: WaveFormInputProps) {
  function handleWaveFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 3) return;

    const input = e.target.value.toUpperCase();

    if (input.length === 1) {
      if (input === "-") {
        setWaveForm("---");
      } else if (input === "T") {
        setWaveForm("TRI");
      } else if (input === "S") {
        setWaveForm("S");
      }
    } else if (input.length === 2) {
      if (input === "SQ") {
        setWaveForm("SQR");
      } else if (input === "SA") {
        setWaveForm("SAW");
      } else if (input === "SI") {
        setWaveForm("SIN");
      }
    } else if (input.length === 3 && validWaveForms.includes(input)) {
      setWaveForm(input);
    }
  }

  function handleWaveFormKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      setWaveForm("");
      return;
    }

    if (e.key === "-" && waveForm !== "---") {
      setWaveForm("---");
      return;
    }

    if (e.key === "t" && waveForm !== "TRI") {
      setWaveForm("TRI");
      return;
    }

    if (e.key === "s" && waveForm !== "S") {
      setWaveForm("S");
      return;
    }
  }

  function handleWaveFormBlur() {
    if (waveForm.length !== 3) {
      setWaveForm("---");
    }
  }

  return (
    <input
      ref={ref}
      type="text"
      placeholder="___"
      maxLength={3}
      data-continue={waveForm === "---"}
      className="w-6 focus:outline-0 data-[continue=true]:text-muted-foreground"
      value={waveForm}
      onChange={handleWaveFormChange}
      onKeyDown={handleWaveFormKeyDown}
      onBlur={handleWaveFormBlur}
      pattern="^(SIN|SQR|SAW|TRI|---)$"
      onFocus={setFocus}
    />
  );
}
