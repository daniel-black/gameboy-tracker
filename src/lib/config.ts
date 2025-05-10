import { ChannelIndex } from "@/audio/types";

export const channelConfig = [
  {
    name: "Pulse 1",
    inputs: [
      { name: "note", length: 3 },
      { name: "volume", length: 2 },
      { name: "dutyCycle", length: 2 },
      { name: "envelope", length: 2 },
      { name: "sweep", length: 3 },
    ],
  },
  {
    name: "Pulse 2",
    inputs: [
      { name: "note", length: 3 },
      { name: "volume", length: 2 },
      { name: "dutyCycle", length: 2 },
      { name: "envelope", length: 2 },
    ],
  },
  {
    name: "Wave",
    inputs: [
      { name: "note", length: 3 },
      { name: "volume", length: 2 },
      { name: "waveForm", length: 3 },
    ],
  },
  {
    name: "Noise",
    inputs: [
      { name: "rate", length: 3 },
      { name: "volume", length: 2 },
      { name: "envelope", length: 2 },
    ],
  },
] as const;

const INPUTS = [
  "note",
  "volume",
  "dutyCycle",
  "envelope",
  "sweep",
  "waveForm",
  "rate",
] as const;
export type InputType = (typeof INPUTS)[number];

export function getChannelName(channelIndex: ChannelIndex): string {
  return channelConfig[channelIndex].name;
}
