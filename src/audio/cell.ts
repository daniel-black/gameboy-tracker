import { WAVE_FORMS } from "./constants";

export type Cell = {
  pulse1: Pulse1Cell;
  pulse2: Pulse2Cell;
  wave: WaveCell;
  noise: NoiseCell;
};

export interface Pulse1Cell {
  note: string;
  volume: string;
  dutyCycle: string;
  envelope: string;
  sweep: string;
}

export interface Pulse2Cell {
  note: string;
  volume: string;
  dutyCycle: string;
  envelope: string;
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
  envelope: string;
}

export function createDefaultPulse1Cell(): Pulse1Cell {
  return {
    note: "---",
    volume: "--",
    dutyCycle: "--",
    envelope: "--",
    sweep: "---",
  };
}

export function createDefaultPulse2Cell(): Pulse2Cell {
  return {
    note: "---",
    volume: "--",
    dutyCycle: "--",
    envelope: "--",
  };
}

export function createDefaultWaveCell(): WaveCell {
  return {
    note: "---",
    waveForm: "---",
    volume: "--",
  };
}

export function createDefaultNoiseCell(): NoiseCell {
  return {
    rate: "--",
    volume: "--",
    envelope: "--",
  };
}
