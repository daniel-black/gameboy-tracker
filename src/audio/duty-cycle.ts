import { DutyCycle } from "./wave-shaper";

export function getDutyCycle(dutyCycleString: string): DutyCycle {
  if (dutyCycleString === "12") return 0.125;
  if (dutyCycleString === "25") return 0.25;
  if (dutyCycleString === "50") return 0.5;
  if (dutyCycleString === "75") return 0.75;

  // should not get down here
  console.warn("Invalid duty cycle string:", dutyCycleString);
  return 0.5;
}
