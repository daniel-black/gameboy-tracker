import { ChannelIndex } from "@/audio/types";

export const channelConfig = [
  {
    name: "Pulse 1",
    inputs: [
      {
        name: "note",
        length: 3,
        description:
          "The note you want to play in note-octave format. Octaves range from 2 to 7 (C-2, C-7). To turn off the row, enter 'OFF'. The continue symbol '---' will continue playing the previous note.",
      },
      {
        name: "volume",
        length: 2,
        description:
          "The volume for the note. Ranges from 00 (silent) to 15 (full volume). '--' to continue the previous volume level.",
      },
      {
        name: "dutyCycle",
        length: 2,
        description:
          "The duty cycle for the pulse wave. Options are '12' (12.5%), '25', '50', and '75'. '--' to continue the previous duty cycle.",
      },
      {
        name: "envelope",
        length: 2,
        description:
          "The envelope for the row. The first character can be '0' or '1'. A '0' indicates an decrease in volume over time. '1' indicates an increase in volume over time. The second character is the speed of the envelope. This can range from '1' (fastest rate of change) to '7' (slowest rate of change). '--' to continue the previous envelope.",
      },
      {
        name: "sweep",
        length: 3,
        description:
          "The sweep for a row. This allows you to change the frequency during the playback of the row. The first character is the sweep direction. '0' indicates a decrease in frequency, while '1' indicates an increase in frequency. The second character is the speed of the sweep. This can range from '1' (fastest rate of change) to '7' (slowest rate of change). The third character is the length of the sweep. This can be '0' (shortest length) to '7' (longest length). '--' to continue the previous sweep.",
      },
    ],
  },
  {
    name: "Pulse 2",
    inputs: [
      {
        name: "note",
        length: 3,
        description:
          "The note you want to play in note-octave format. Octaves range from 2 to 7 (C-2, C-7). To turn off the row, enter 'OFF'. The continue symbol '---' will continue playing the previous note.",
      },
      {
        name: "volume",
        length: 2,
        description:
          "The volume for the note. Ranges from 00 (silent) to 15 (full volume). '--' to continue the previous volume level.",
      },
      {
        name: "dutyCycle",
        length: 2,
        description:
          "The duty cycle for the pulse wave. Options are '12' (12.5%), '25', '50', and '75'. '--' to continue the previous duty cycle.",
      },
      {
        name: "envelope",
        length: 2,
        description:
          "The envelope for the row. The first character can be '0' or '1'. A '0' indicates an decrease in volume over time. '1' indicates an increase in volume over time. The second character is the speed of the envelope. This can range from '1' (fastest rate of change) to '7' (slowest rate of change). '--' to continue the previous envelope.",
      },
    ],
  },
  {
    name: "Wave",
    inputs: [
      {
        name: "note",
        length: 3,
        description:
          "The note you want to play in note-octave format. Octaves range from 2 to 7 (C-2, C-7). To turn off the row, enter 'OFF'. The continue symbol '---' will continue playing the previous note.",
      },
      {
        name: "volume",
        length: 2,
        description:
          "The volume for the wave channel. Options are 'LO' (low), 'MD' (medium), 'HI' (high), 'OF' (off), or '--' (continue previous volume level).",
      },
      {
        name: "waveForm",
        length: 3,
        description:
          "The wave form to played. Options are 'SIN' (sine), 'SQR' (square), 'SAW' (sawtooth), and 'TRI (triangle). To continue the previous wave form, enter '---'.",
      },
    ],
  },
  {
    name: "Noise",
    inputs: [
      {
        name: "rate",
        length: 3,
        description:
          "The playback rate for the noise channel. Range of values can be from '00' (0.0x speed) to '99' (9.9x speed). For the standard rate, enter '10' (1.0x speed).",
      },
      {
        name: "volume",
        length: 2,
        description:
          "The volume for the note. Ranges from 00 (silent) to 15 (full volume). '--' to continue the previous volume level.",
      },
      {
        name: "envelope",
        length: 2,
        description:
          "The envelope for the row. The first character can be '0' or '1'. A '0' indicates an decrease in volume over time. '1' indicates an increase in volume over time. The second character is the speed of the envelope. This can range from '1' (fastest rate of change) to '7' (slowest rate of change). '--' to continue the previous envelope.",
      },
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
