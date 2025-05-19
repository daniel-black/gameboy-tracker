const validWaveVolumes = ["--", "OF", "LO", "MD", "HI"];

type WaveVolumeInputProps = {
  volume: string;
  setVolume: (newVolume: string) => void;
  ref: React.Ref<HTMLInputElement>;
  setFocus: () => void;
};

export function WaveVolumeInput({
  volume,
  setVolume,
  ref,
  setFocus,
}: WaveVolumeInputProps) {
  // This may not actually ever run since the onKeyDown kinda overrides it
  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 2) return;

    const input = e.target.value.toUpperCase();

    if (input.length === 1) {
      if (input === "-") {
        setVolume("--");
      } else if (input === "O") {
        setVolume("OF"); // OF = Off
      } else if (input === "L") {
        setVolume("LO");
      } else if (input === "M") {
        setVolume("MD");
      } else if (input === "H") {
        setVolume("HI");
      }
    } else if (input.length === 2 && validWaveVolumes.includes(input)) {
      setVolume(input);
    }
  }

  function handleVolumeKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && volume.length === 2) {
      e.preventDefault();
      setVolume("");
    } else if (e.key === "-" && volume !== "--") {
      setVolume("--");
    } else if (e.key === "o" && volume !== "OF") {
      setVolume("OF");
    } else if (e.key === "l" && volume !== "LO") {
      setVolume("LO");
    } else if (e.key === "m" && volume !== "MD") {
      setVolume("MD");
    } else if (e.key === "h" && volume !== "HI") {
      setVolume("HI");
    }
  }

  function handleVolumeBlur() {
    if (volume.length !== 2) {
      setVolume("--");
    }
  }

  return (
    <input
      ref={ref}
      type="text"
      placeholder="__"
      maxLength={2}
      data-continue={volume === "--"}
      className="w-[26px] focus:bg-primary focus:outline-0 data-[continue=true]:text-muted-foreground"
      value={volume}
      onChange={handleVolumeChange}
      onKeyDown={handleVolumeKeyDown}
      onBlur={handleVolumeBlur}
      onFocus={setFocus}
    />
  );
}
