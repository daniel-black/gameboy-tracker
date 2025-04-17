/**
 * Precomputed volume values for the audio system. Users can specify a volume level [0, 15]. This maps to [0, 1] in increments of 1/15.
 * @example
 * // User specifies volume level 7
 * let volume = VOLUME[7]; // 0.4666666666666667;
 */
export const VOLUME = [
  0, 0.06666666666666667, 0.13333333333333333, 0.2, 0.26666666666666666,
  0.3333333333333333, 0.4, 0.4666666666666667, 0.5333333333333333, 0.6,
  0.6666666666666666, 0.7333333333333333, 0.8, 0.8666666666666667,
  0.9333333333333333, 1,
] as const;

type Indices<T extends readonly any[]> = Exclude<keyof T, keyof []>;
type ToNumber<S extends string> = S extends `${infer N extends number}`
  ? N
  : never;
export type VolumeLevel = ToNumber<Indices<typeof VOLUME>>;

export function getVolume(volumeString: string) {
  const parsedVolume = parseInt(volumeString, 10);
  if (isNaN(parsedVolume)) {
    console.warn("Invalid volume string:", volumeString);
    return 0;
  }
  if (parsedVolume < 0 || parsedVolume > 15) {
    console.warn("Volume out of range:", parsedVolume);
    return 0;
  }
  return VOLUME[parsedVolume] || 0;
}

export type WaveVolumeLevel = 0 | 0.25 | 0.5 | 1;

export const WAVE_VOLUME_KEYS = ["OF", "LO", "MD", "HI"] as const;

export const waveVolumeMap = new Map<string, number>([
  ["OF", 0],
  ["LO", 0.25],
  ["MD", 0.5],
  ["HI", 1],
]);

export function getWaveVolume(volumeString: string) {
  return waveVolumeMap.get(volumeString) ?? 0;
}

/**
 * Checks if a value is a valid VolumeLevel (0-15)
 * @param value The value to check
 * @returns A type predicate indicating whether the value is a VolumeLevel
 */
export function isVolumeLevel(value: unknown): value is VolumeLevel {
  // Check if value is a number
  if (typeof value !== "number") return false;

  // Check if value is an integer
  if (!Number.isInteger(value)) return false;

  // Check if value is within the valid range [0, 15]
  return value >= 0 && value <= 15;
}

/**
 * Asserts that a value is a valid VolumeLevel
 * @param value The value to check
 * @throws Error if the value is not a valid VolumeLevel
 */
export function assertVolumeLevel(
  value: unknown
): asserts value is VolumeLevel {
  if (!isVolumeLevel(value)) {
    throw new Error(
      `Expected a volume level between 0 and 15, but got: ${value}`
    );
  }
}

/**
 * Checks if a value is a valid WaveVolumeLevel (0, 0.25, 0.5, or 1)
 * @param value The value to check
 * @returns A type predicate indicating whether the value is a WaveVolumeLevel
 */
export function isWaveVolumeLevel(value: unknown): value is WaveVolumeLevel {
  // Check if value is a number
  if (typeof value !== "number") return false;

  // Check if value is one of the specific allowed values
  return value === 0 || value === 0.25 || value === 0.5 || value === 1;
}

/**
 * Asserts that a value is a valid WaveVolumeLevel
 * @param value The value to check
 * @throws Error if the value is not a valid WaveVolumeLevel
 */
export function assertWaveVolumeLevel(
  value: unknown
): asserts value is WaveVolumeLevel {
  if (!isWaveVolumeLevel(value)) {
    throw new Error(
      `Expected a wave volume level of 0, 0.25, 0.5, or 1, but got: ${value}`
    );
  }
}
