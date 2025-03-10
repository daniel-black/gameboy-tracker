/**
 * The resolution of a wave shaper curve
 */
const CURVE_LENGTH = 2048 as const;

/**
 * Standard duty cycles for a pulse square wave
 */
const DUTY_CYCLES = [0.125, 0.25, 0.5, 0.75] as const;

/**
 * A standard duty cycle for a square wave (corresponds to 12.5%, )
 */
export type DutyCycle = (typeof DUTY_CYCLES)[number];

/**
 * Creates a wave shaper curve for a square wave with the specified duty cycle.
 *
 * @param dutyCycle - The proportion of the cycle that the signal is "high" (0.125, 0.25, 0.5, or 0.75)
 * @returns A Float32Array containing the wave shaper curve values
 */
function createWaveShaperCurve(dutyCycle: DutyCycle) {
  const curve = new Float32Array(CURVE_LENGTH);

  for (let i = 0; i < CURVE_LENGTH; i++) {
    // Convert the index to a value between 0 and 1
    const x = i / (CURVE_LENGTH - 1);

    // Create a step function at the duty cycle point
    curve[i] = x < dutyCycle ? 1.0 : -1.0;
  }

  return curve;
}

/**
 * Pre-computed wave shaper curves for standard duty cycles
 */
const waveShaperCurves: Record<DutyCycle, Float32Array<ArrayBuffer>> = {
  0.125: createWaveShaperCurve(0.125),
  0.25: createWaveShaperCurve(0.25),
  0.5: createWaveShaperCurve(0.5),
  0.75: createWaveShaperCurve(0.75),
} as const;

/**
 * Get a wave shaper curve for a preset duty cycle (0.125, 0.25, 0.5, or 0.75)
 *
 * @param dutyCycle - The desired duty cycle (0.125, 0.25, 0.5, or 0.75)
 * @returns A Float32Array containing the wave shaper curve
 */
export function getWaveShaperCurve(dutyCycle: DutyCycle) {
  return waveShaperCurves[dutyCycle];
}
