import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface Pattern {
  pulse1: Array<Row>;
  pulse2: Array<Row>;
  wave: Array<Row>;
  noise: Array<Row>;
}

export type Channel = keyof Pattern;

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
  patterns: [getDefaultPattern()],
  isPlaying: false,
  currentPlaybackRow: 0,
};

function getDefaultPattern(): Pattern {
  return {
    pulse1: new Array(64).fill(getDefaultRow()),
    pulse2: new Array(64).fill(getDefaultRow()),
    wave: new Array(64).fill(getDefaultRow()),
    noise: new Array(64).fill(getDefaultRow()),
  };
}

// temporary type. going to make actual ones soon.
type Row = {
  note: number;
  volume: number;
  effect: number;
};

function getDefaultRow(): Row {
  return {
    note: 0,
    volume: 0,
    effect: 0,
  };
}

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
    setPatterns: (state, action: PayloadAction<Song["patterns"]>) => {
      state.patterns = action.payload;
    },
    addPattern: (state) => {
      state.patterns.push(getDefaultPattern());
    },
    setCurrentPatternIndex: (
      state,
      action: PayloadAction<Song["currentPatternIndex"]>
    ) => {
      state.currentPatternIndex = action.payload;
    },
    setRowNote: (
      state,
      action: PayloadAction<RowIdentifier & { note: number }>
    ) => {
      const { patternIndex, channel, rowIndex, note } = action.payload;
      state.patterns[patternIndex][channel][rowIndex].note = note;
    },
    setRowVolume: (
      state,
      action: PayloadAction<RowIdentifier & { volume: number }>
    ) => {
      const { patternIndex, channel, rowIndex, volume } = action.payload;
      state.patterns[patternIndex][channel][rowIndex].volume = volume;
    },
    setRowEffect: (
      state,
      action: PayloadAction<RowIdentifier & { effect: number }>
    ) => {
      const { patternIndex, channel, rowIndex, effect } = action.payload;
      state.patterns[patternIndex][channel][rowIndex].effect = effect;
    },
  },
});

export const {
  setSongName,
  setBeatsPerMinute,
  setOrderList,
  setPatterns,
  addPattern,
  setCurrentPatternIndex,
  setRowNote,
  setRowVolume,
  setRowEffect,
} = songSlice.actions;

export const selectSongName = (state: RootState) => state.song.name;
export const selectBeatsPerMinute = (state: RootState) =>
  state.song.beatsPerMinute;
export const selectOrderList = (state: RootState) => state.song.orderList;
export const selectPatterns = (state: RootState) => state.song.patterns;
export const selectCurrentPatternIndex = (state: RootState) =>
  state.song.currentPatternIndex;

export default songSlice.reducer;
