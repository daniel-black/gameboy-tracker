import { NoiseCell, Pulse1Cell, Pulse2Cell, WaveCell } from "./cell";
import { CHANNELS } from "./constants";

export interface Channels {
  pulse1: {
    source: OscillatorNode;
    waveShaper: WaveShaperNode;
    gainNode: GainNode;
    gate: GainNode;
  };
  pulse2: {
    source: OscillatorNode;
    gainNode: GainNode;
    waveShaper: WaveShaperNode;
    gate: GainNode;
  };
  wave: {
    source: OscillatorNode | null;
    gainNode: GainNode;
    gate: GainNode;
  };
  noise: {
    source: AudioBufferSourceNode | null;
    gainNode: GainNode;
    gate: GainNode;
  };
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

export type ChannelType = (typeof CHANNELS)[number];
