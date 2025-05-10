import { Row } from "./types";

export type UnifiedCell = {
  note?: string; // 3 wide string, "D-4", "C#5", "OFF", "---", etc
  rate?: string; // 2 wide string, "01" -> 0.1, "10" -> 1.0, "99" -> 9.9, only used by noise channel
  volume: string; // 2 wide string, "00" to "15" or "--" for all but the wave channel; for wave, "OF", "LO", "MD", "HI", or "--"
  dutyCycle?: string; // 2 wide string, "12" (maps to 12.5%), "25", "50", "75" for pulse channels
  waveForm?: string; // 3 wide string, "TRI", "SAW", "SQR", "SIN" for wave channel only
  envelope?: string; // 2 wide string, first char is "O" (decrease) or "1" (increase), second char is "0" to "7" and denotes step size; all but wave have this
  sweep?: string; // 3 wide string, first char is "O" (decrease) or "1" (increase), second char is "0" to "7" and denotes step size, third char is "0" to "7" and denotes period; only used by pulse 1 channel
};

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

function createDefaultPulse1Cell(): UnifiedCell {
  return {
    note: "---",
    volume: "--",
    dutyCycle: "--",
    envelope: "--",
    sweep: "---",
  };
}

function createDefaultPulse2Cell(): UnifiedCell {
  return {
    note: "---",
    volume: "--",
    dutyCycle: "--",
    envelope: "--",
  };
}

function createDefaultWaveCell(): UnifiedCell {
  return {
    note: "---",
    waveForm: "---",
    volume: "--",
  };
}

function createDefaultNoiseCell(): UnifiedCell {
  return {
    rate: "--",
    volume: "--",
    envelope: "--",
  };
}

export function createDefaultRow(): Row {
  return [
    createDefaultPulse1Cell(),
    createDefaultPulse2Cell(),
    createDefaultWaveCell(),
    createDefaultNoiseCell(),
  ];
}
