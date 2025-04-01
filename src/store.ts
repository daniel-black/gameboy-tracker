import { atom } from "jotai";

type CellCoordinates = { row: number; col: number };

export const activeCellAtom = atom<CellCoordinates | null>(null);
