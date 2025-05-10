import { CHANNEL_INDICES, WAVE_FORMS } from "./constants";
import { UnifiedCell } from "./cell";

export type Channels = [PulseChannel, PulseChannel, WaveChannel, NoiseChannel];

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
  data: Array<Row>;
}

export type Row = [UnifiedCell, UnifiedCell, UnifiedCell, UnifiedCell];

export type PatternMetadata = Omit<Pattern, "data">;

export type ChannelIndex = (typeof CHANNEL_INDICES)[number];

export type WaveForm = (typeof WAVE_FORMS)[number];
