import { Note } from "./notes";
import { VolumeLevel } from "./volume";
import { DutyCycle } from "./wave-shaper";

export type Pattern = {
  pulse1: Array<PulseRow>;
  pulse2: Array<PulseRow>;
  wave: Array<WaveRow>;
  noise: Array<NoiseRow>;
};

export type Channel = keyof Pattern;

export type PulseRow = {
  note: Note;
  duty: DutyCycle;
  volume: VolumeLevel;
};

function createDefaultPulseRow(): PulseRow {
  return {
    note: "---",
    duty: 0.5,
    volume: 1,
  };
}

// type Pulse2Row = {
//   note: Note;
//   duty: DutyCycle;
//   volume: VolumeLevel;
// };

// keep this simple initially by letting users select a preset wave type like "sine", "square", "sawtooth", "triangle"
type WaveRow = {
  note: Note;
  volume: 0 | 0.25 | 0.5 | 1;
};

function createDefaultWaveRow(): WaveRow {
  return {
    note: "---",
    volume: 1,
  };
}

type NoiseRow = {
  note: Note;
  volume: VolumeLevel;
};

function createDefaultNoiseRow(): NoiseRow {
  return {
    note: "---",
    volume: 1,
  };
}

export function createDefaultPattern(): Pattern {
  return {
    pulse1: new Array(64).fill(createDefaultPulseRow()),
    pulse2: new Array(64).fill(createDefaultPulseRow()),
    wave: new Array(64).fill(createDefaultWaveRow()),
    noise: new Array(64).fill(createDefaultNoiseRow()),
  };
}
