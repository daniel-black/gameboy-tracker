import { atom } from "jotai";

type SectionRange = {
  start: number | null;
  end: number | null;
};

export const sectionRangeAtom = atom<SectionRange>({ start: null, end: null });

// If a cell is active, then both row and col are not null
// If a row is active, then col is null and row is a number
export const activeAtom = atom<{ row: number | null; col: number | null }>({
  row: null,
  col: null,
});

export const inputIndexAtom = atom<number | null>(null);
