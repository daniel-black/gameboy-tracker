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

export const CHANNEL_INDICES = [0, 1, 2, 3] as const;

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

export const ENVELOPE_TICKS_PER_ROW = 8 as const;

export const SWEEP_TICKS_PER_ROW = 16 as const;

export const MAX_FREQUENCY = 20_000 as const;

export const MIN_FREQUENCY = 40 as const;
