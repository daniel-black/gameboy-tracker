import { WAVE_FORMS } from "./constants";
import { Note } from "./notes";
import { VolumeLevel, WaveVolumeLevel } from "./volume";
import { DutyCycle } from "./wave-shaper";

export interface Pulse1Cell {
  note: string;
  volume: string;
  dutyCycle: string;
}

export interface Pulse2Cell {
  note: string;
  volume: string;
  dutyCycle: string;
}

export type WaveForm = (typeof WAVE_FORMS)[number];

export interface WaveCell {
  note: string;
  waveForm: string;
  volume: string;
}

export interface NoiseCell {
  rate: string; // this should be something between like 0.1 and 10
  volume: string;
}

export function createDefaultPulse1Cell(): Pulse1Cell {
  return {
    note: "---",
    volume: "--",
    dutyCycle: "--",
  };
}

export function createDefaultPulse2Cell(): Pulse2Cell {
  return {
    note: "---",
    volume: "--",
    dutyCycle: "--",
  };
}

export function createDefaultWaveCell(): WaveCell {
  return {
    note: "---",
    waveForm: "---",
    volume: "---",
  };
}

export function createDefaultNoiseCell(): NoiseCell {
  return {
    rate: "---", // off
    volume: "--",
  };
}
