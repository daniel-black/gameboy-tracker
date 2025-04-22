import { NoiseCell, Pulse1Cell, Pulse2Cell, WaveCell } from "./cell";
import { CHANNELS } from "./constants";

export interface Channels {
  pulse1: PulseChannel;
  pulse2: PulseChannel;
  wave: WaveChannel;
  noise: NoiseChannel;
}

interface PulseChannel extends BaseChannel {
  source: OscillatorNode;
  waveShaper: WaveShaperNode;
}

interface WaveChannel extends BaseChannel {
  source: OscillatorNode;
}

interface NoiseChannel extends BaseChannel {
  source: AudioBufferSourceNode;
}

interface BaseChannel {
  gainNode: GainNode;
  gate: GainNode;
}

export interface Pattern {
  id: string;
  name: string;
  cells: {
    pulse1: Array<Pulse1Cell>;
    pulse2: Array<Pulse2Cell>;
    wave: Array<WaveCell>;
    noise: Array<NoiseCell>;
  };
}

export type PatternMetadata = Omit<Pattern, "cells">;

export type ChannelType = (typeof CHANNELS)[number];
