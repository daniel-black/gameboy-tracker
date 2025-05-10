import { atom } from "jotai";

type ActiveState = {
  active: {
    row: number | null;
    col: number | null;
  };
  inputIndex: number | null;
};

export const activeStateAtom = atom<ActiveState>({
  active: {
    row: null,
    col: null,
  },
  inputIndex: null,
});

type SelectedState = {
  start: number | null;
  end: number | null;
};

export const selectedStateAtom = atom<SelectedState>({
  start: null,
  end: null,
});
