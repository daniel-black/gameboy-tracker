import { Note } from "./notes";
import { VolumeLevel, WaveVolumeLevel } from "./volume";
import { DutyCycle } from "./wave-shaper";

export interface PulseCell {
  note: Note;
  volume: VolumeLevel;
  dutyCycle: DutyCycle;
}

export interface WaveCell {
  note: Note;
  waveForm: any; // idk about this yet
  volume: WaveVolumeLevel;
}

export interface NoiseCell {
  rate: number;
  volume: VolumeLevel;
}

export function createDefaultPulseCell(): PulseCell {
  return {
    note: "---",
    volume: 15,
    dutyCycle: 0.5,
  };
}

export function createDefaultWaveCell(): WaveCell {
  return {
    note: "---",
    waveForm: null,
    volume: 1,
  };
}

export function createDefaultNoiseCell(): NoiseCell {
  return {
    rate: 5,
    volume: 5,
  };
}
