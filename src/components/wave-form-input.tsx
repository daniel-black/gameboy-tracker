type WaveFormInputProps = {
  waveForm: string;
  setWaveForm: (newWaveForm: string) => void;
};

const validWaveForms = ["---", "SIN", "SQR", "SAW", "TRI"];

export function WaveFormInput({ waveForm, setWaveForm }: WaveFormInputProps) {
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
      type="text"
      placeholder="⋅⋅⋅"
      maxLength={3}
      className="w-6 focus:outline-0"
      value={waveForm}
      onChange={handleWaveFormChange}
      onKeyDown={handleWaveFormKeyDown}
      onBlur={handleWaveFormBlur}
    />
  );
}
