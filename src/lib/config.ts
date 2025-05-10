import { ChannelIndex } from "@/audio/types";
import {
  getHandleDutyCycleBlur,
  getHandleDutyCycleChange,
  getHandleDutyCycleKeyDown,
} from "@/components/duty-cycle-input";
import {
  getHandleEnvelopeBlur,
  getHandleEnvelopeChange,
  getHandleEnvelopeKeyDown,
} from "@/components/envelope-input";
import {
  getHandleRateBlur,
  getHandleRateChange,
  getHandleRateKeyDown,
} from "@/components/noise-rate-input";
import {
  getHandleNoteBlur,
  getHandleNoteChange,
  getHandleNoteKeyDown,
} from "@/components/note-input";
import {
  getHandleSweepBlur,
  getHandleSweepChange,
  getHandleSweepKeyDown,
} from "@/components/sweep-input";
import {
  getHandleVolumeBlur,
  getHandleVolumeChange,
  getHandleVolumeKeyDown,
} from "@/components/volume-input";
import {
  getHandleWaveFormBlur,
  getHandleWaveFormChange,
  getHandleWaveFormKeyDown,
} from "@/components/wave-form-input";

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

export const inputConfig = {
  note: {
    length: 3,
    handlers: {
      getOnChange: getHandleNoteChange,
      getOnKeyDown: getHandleNoteKeyDown,
      getOnBlur: getHandleNoteBlur,
    },
  },
  volume: {
    length: 2,
    handlers: {
      getOnChange: getHandleVolumeChange,
      getOnKeyDown: getHandleVolumeKeyDown,
      getOnBlur: getHandleVolumeBlur,
    },
  },
  dutyCycle: {
    length: 2,
    handlers: {
      getOnChange: getHandleDutyCycleChange,
      getOnKeyDown: getHandleDutyCycleKeyDown,
      getOnBlur: getHandleDutyCycleBlur,
    },
  },
  envelope: {
    length: 2,
    handlers: {
      getOnChange: getHandleEnvelopeChange,
      getOnKeyDown: getHandleEnvelopeKeyDown,
      getOnBlur: getHandleEnvelopeBlur,
    },
  },
  sweep: {
    length: 3,
    handlers: {
      getOnChange: getHandleSweepChange,
      getOnKeyDown: getHandleSweepKeyDown,
      getOnBlur: getHandleSweepBlur,
    },
  },
  waveForm: {
    length: 3,
    handlers: {
      getOnChange: getHandleWaveFormChange,
      getOnKeyDown: getHandleWaveFormKeyDown,
      getOnBlur: getHandleWaveFormBlur,
    },
  },
  rate: {
    length: 3,
    handlers: {
      getOnChange: getHandleRateChange,
      getOnKeyDown: getHandleRateKeyDown,
      getOnBlur: getHandleRateBlur,
    },
  },
} as const;
