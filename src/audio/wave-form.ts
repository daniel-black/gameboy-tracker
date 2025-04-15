export const waveFormMap = new Map<string, OscillatorType>([
  ["TRI", "triangle"],
  ["SQR", "square"],
  ["SAW", "sawtooth"],
  ["SIN", "sine"],
]);

export function getWaveForm(waveFormString: string): OscillatorType {
  const waveForm = waveFormMap.get(waveFormString);
  if (waveForm) {
    return waveForm;
  } else {
    console.warn("Invalid wave form string:", waveFormString);
    return "sine"; // default value
  }
}
