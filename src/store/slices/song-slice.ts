import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Channel, createDefaultPattern, Pattern } from "../../audio/patterns";
import { Note } from "../../audio/notes";
import { VolumeLevel } from "../../audio/volume";

export interface Song {
  name: string | undefined;
  beatsPerMinute: number;
  orderList: Array<number>;
  patterns: Array<Pattern>;
  currentPatternIndex: number;
  isPlaying: boolean;
  currentPlaybackRow: number;
}

const initialState: Song = {
  name: undefined,
  beatsPerMinute: 120,
  orderList: [0],
  currentPatternIndex: 0,
  patterns: [createDefaultPattern()],
  isPlaying: false,
  currentPlaybackRow: 0,
};

type RowIdentifier = {
  patternIndex: number;
  channel: Channel;
  rowIndex: number;
};

export const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    setSongName: (state, action: PayloadAction<Song["name"]>) => {
      state.name = action.payload;
    },
    setBeatsPerMinute: (
      state,
      action: PayloadAction<Song["beatsPerMinute"]>
    ) => {
      state.beatsPerMinute = action.payload;
    },
    setOrderList: (state, action: PayloadAction<Song["orderList"]>) => {
      state.orderList = action.payload;
    },
    addPattern: (state) => {
      state.patterns.push(createDefaultPattern());
    },
    setCurrentPatternIndex: (
      state,
      action: PayloadAction<Song["currentPatternIndex"]>
    ) => {
      state.currentPatternIndex = action.payload;
    },
    setRowNote: (
      state,
      action: PayloadAction<RowIdentifier & { note: Note }>
    ) => {
      const { patternIndex, channel, rowIndex, note } = action.payload;
      state.patterns[patternIndex][channel][rowIndex].note = note;
    },
    setRowVolume: (
      state,
      action: PayloadAction<RowIdentifier & { volume: VolumeLevel }>
    ) => {
      const { patternIndex, channel, rowIndex, volume } = action.payload;
      state.patterns[patternIndex][channel][rowIndex].volume = volume;
    },
    startPlayback: (state) => {
      state.isPlaying = true;
    },
    setCurrentPlaybackRow: (state, action: PayloadAction<number>) => {
      state.currentPlaybackRow = action.payload;
    },
  },
});

export const {
  setSongName,
  setBeatsPerMinute,
  setOrderList,
  addPattern,
  setCurrentPatternIndex,
  setRowNote,
  setRowVolume,
  startPlayback,
  setCurrentPlaybackRow,
} = songSlice.actions;

export const selectSongName = (state: RootState) => state.song.name;
export const selectBeatsPerMinute = (state: RootState) =>
  state.song.beatsPerMinute;
export const selectOrderList = (state: RootState) => state.song.orderList;
export const selectPatterns = (state: RootState) => state.song.patterns;
export const selectCurrentPatternIndex = (state: RootState) =>
  state.song.currentPatternIndex;

export default songSlice.reducer;
