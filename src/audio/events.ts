import { ChannelIndex } from "./types";

export interface TrackerEventMap {
  // Global control events
  changedBpm: { bpm: number };
  changedMasterVolume: { volume: number };
  changedLooping: { isLooping: boolean };
  changedCurrentPattern: { patternId: string };
  addedPattern: { patternId: string };
  deletedPattern: { patternId: string };
  toggledChannel: { channelIndex: ChannelIndex; enabled: boolean };

  // Editor events
  changedCell: { row: number; col: ChannelIndex };

  // Playback events
  startedPlayback: { row: number; patternId: string };
  pausedPlayback: { row: number; patternId: string };
  resumedPlayback: { row: number; patternId: string };
  stoppedPlayback: { row: number; patternId: string };
  changedPlaybackRow: { row: number; patternId: string; time: number };
}
