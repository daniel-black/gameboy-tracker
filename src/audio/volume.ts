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

export function getVolume(volumeLevel: VolumeLevel) {
  return VOLUME[volumeLevel] || 0;
}

export type WaveVolumeLevel = 0 | 0.25 | 0.5 | 1;
