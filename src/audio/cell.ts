import { Note } from "./notes";
import { VolumeLevel, WaveVolumeLevel } from "./volume";
import { DutyCycle } from "./wave-shaper";

export interface Pulse1Cell {
  note: Note;
  volume: VolumeLevel;
  dutyCycle: DutyCycle;
}

export interface Pulse2Cell {
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
  rate: number; // this should be something between like 0.1 and 10
  volume: VolumeLevel;
}

export function createDefaultPulse1Cell(): Pulse1Cell {
  return {
    note: "---",
    volume: 15,
    dutyCycle: 0.5,
  };
}

export function createDefaultPulse2Cell(): Pulse2Cell {
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
    rate: 0, // off
    volume: 15,
  };
}
