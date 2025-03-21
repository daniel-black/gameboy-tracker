import { ChannelType } from "./types";

export interface TrackerEventMap {
  changedBpm: { bpm: number };
  changedCurrentPattern: { patternId: string };
  toggledChannel: { channel: ChannelType; enabled: boolean };
  changedPulse1Cell: { row: number };
  changedPulse2Cell: { row: number };
  changedWaveCell: { row: number };
  changedNoiseCell: { row: number };
  startedPlayback: { row: number; patternId: string };
  playedRow: { row: number; patternId: string; time: number };
  stoppedPlayback: {};
  resumedPlayback: { row: number; patternId: string };
  pausedPlayback: { row: number; patternId: string };
}
