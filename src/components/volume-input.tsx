const validVolumeValues = [
  "--",
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
];

const numberStrings = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function getHandleVolumeChange(setVolume: (newVolume: string) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent more than 2 characters
    if (e.target.value.length > 2) return;

    // Only allow numbers and '-' characters
    if (!/^[0-9-]*$/.test(e.target.value)) {
      return;
    }

    let newInput = e.target.value;

    if (newInput === "-") {
      setVolume("--");
      return;
    }

    // Check for valid input during typing
    const validDuringTyping =
      newInput === "" ||
      /^[0-9]$/.test(newInput) ||
      validVolumeValues.includes(newInput);

    if (validDuringTyping) {
      setVolume(newInput);
      return;
    }
  };
}

export function getHandleVolumeKeyDown(
  volume: string,
  setVolume: (newVolume: string) => void
) {
  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && volume === "--") {
      e.preventDefault();
      setVolume("");
      return;
    }

    if (e.key === "-" && volume.length === 2) {
      setVolume("--");
      return;
    }

    if (volume.length === 2 && numberStrings.includes(e.key)) {
      e.preventDefault();
      setVolume(e.key);
      return;
    }
  };
}

export function getHandleVolumeBlur(
  volume: string,
  setVolume: (newVolume: string) => void
) {
  return () => {
    if (volume.length === 1 && /^[0-9]$/.test(volume[0])) {
      setVolume(`0${volume}`);
      return;
    }

    if (volume.length !== 2) {
      setVolume("--");
    }
  };
}

type VolumeInputProps = {
  volume: string;
  setVolume: (newVolume: string) => void;
  ref: React.Ref<HTMLInputElement>;
  setFocus: () => void;
};

export function VolumeInput({
  volume,
  setVolume,
  ref,
  setFocus,
}: VolumeInputProps) {
  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Prevent more than 2 characters
    if (e.target.value.length > 2) return;

    // Only allow numbers and '-' characters
    if (!/^[0-9-]*$/.test(e.target.value)) {
      return;
    }

    let newInput = e.target.value;

    if (newInput === "-") {
      setVolume("--");
      return;
    }

    // Check for valid input during typing
    const validDuringTyping =
      newInput === "" ||
      /^[0-9]$/.test(newInput) ||
      validVolumeValues.includes(newInput);

    if (validDuringTyping) {
      setVolume(newInput);
      return;
    }
  }

  function handleVolumeKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && volume === "--") {
      e.preventDefault();
      setVolume("");
      return;
    }

    if (e.key === "-" && volume.length === 2) {
      setVolume("--");
      return;
    }

    if (volume.length === 2 && numberStrings.includes(e.key)) {
      e.preventDefault();
      setVolume(e.key);
      return;
    }
  }

  function handleVolumeBlur() {
    if (volume.length === 1 && /^[0-9]$/.test(volume[0])) {
      setVolume(`0${volume}`);
      return;
    }

    if (volume.length !== 2) {
      setVolume("--");
    }
  }

  return (
    <input
      ref={ref}
      type="text"
      placeholder="⋅⋅"
      maxLength={2}
      data-continue={volume === "--"}
      className="w-4 focus:outline-0 invalid:bg-red-200 data-[continue=true]:text-muted-foreground"
      // TODO: Add pattern to validate volume input
      value={volume}
      onChange={handleVolumeChange}
      onKeyDown={handleVolumeKeyDown}
      onBlur={handleVolumeBlur}
      onFocus={setFocus}
    />
  );
}
