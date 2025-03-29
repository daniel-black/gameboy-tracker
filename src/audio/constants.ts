/**
 * The number of rows in a pattern. By convention, this is 64. Since each beat is 4 rows, this means that there are 16 beats in a pattern.
 */
export const ROWS_PER_PATTERN = 64 as const;

/**
 * The number of rows per beat in the tracker. Each beat is a quarter note and there are 4 rows per beat.
 * This means that there are 16 rows per whole note.
 */
export const ROWS_PER_BEAT = 4 as const;

/**
 * The default beats per minute (BPM) for the tracker.
 */
export const DEFAULT_BPM = 120 as const;

/**
 * The maximum number of patterns allowed in the tracker.
 */
export const MAX_PATTERNS = 64 as const;

/**
 * The four channels of the tracker. `pulse1` and `pulse2` are square waves. `wave` can play a custom
 * 32 sample 4-bit waveform. `noise` can play white noise at a specified rate.
 */
export const CHANNELS = ["pulse1", "pulse2", "wave", "noise"] as const;

/**
 * The maximum number of listeners allowed by the event emitter.
 */
export const MAX_LISTENERS = 800;

/**
 * The names of waveforms.
 */
export const WAVE_FORMS = [
  "sine",
  "square",
  "sawtooth",
  "triangle",
  "---",
] as const;
