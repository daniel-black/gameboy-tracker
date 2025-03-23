import { ChannelType } from "./types";

export interface TrackerEventMap {
  // Global control events
  changedBpm: { bpm: number };
  changedMasterVolume: { volume: number };
  changedLooping: { isLooping: boolean };
  changedCurrentPattern: { patternId: string };
  toggledChannel: { channel: ChannelType; enabled: boolean };

  // Editor events
  changedPulse1Cell: { row: number };
  changedPulse2Cell: { row: number };
  changedWaveCell: { row: number };
  changedNoiseCell: { row: number };

  // Playback events
  startedPlayback: { row: number; patternId: string };
  pausedPlayback: { row: number; patternId: string };
  resumedPlayback: { row: number; patternId: string };
  stoppedPlayback: { row: number; patternId: string };
  playedRow: { row: number; patternId: string; time: number };
}
