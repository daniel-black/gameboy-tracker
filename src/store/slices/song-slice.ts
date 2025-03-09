import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { RootState } from "..";

export interface Pattern {
  pulse1: Array<any>;
  pulse2: Array<any>;
  wave: Array<any>;
  noise: Array<any>;
}

export interface Song {
  name: string | undefined;
  beatsPerMinute: number;
  orderList: Array<number>;
  patterns: Array<string>;
}

const initialState: Song = {
  name: undefined,
  beatsPerMinute: 120,
  orderList: [],
  patterns: [],
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
  },
});

export const { setSongName, setBeatsPerMinute, setOrderList, setPatterns } =
  songSlice.actions;

// export const selectSongName = (state: RootState) => state.song.name;
// export const selectBeatsPerMinute = (state: RootState) =>
//   state.song.beatsPerMinute;
// export const selectOrderList = (state: RootState) => state.song.orderList;
// export const selectPatterns = (state: RootState) => state.song.patterns;

export default songSlice.reducer;
