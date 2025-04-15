import { atom } from "jotai";

type SectionRange = {
  start: number | null;
  end: number | null;
};

export const sectionRangeAtom = atom<SectionRange>({ start: null, end: null });
