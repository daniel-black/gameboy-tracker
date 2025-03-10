import { getFrequency } from "./notes";
import { PulseRow } from "./patterns";
import { getVolume, VolumeLevel } from "./volume";
import { DutyCycle, getWaveShaperCurve } from "./wave-shaper";

type SquareWaveOptions = {
  dutyCycle: DutyCycle;
  volume: VolumeLevel;
  frequency: number;
};

export class SquareWave {
  private context: AudioContext;
  public source: OscillatorNode;
  public gainNode: GainNode;
  private waveshaper: WaveShaperNode;

  // Default parameters
  public frequency: number = 440;
  private dutyCycle: DutyCycle = 0.5;
  private volume: number = 0.5;

  constructor(
    context: AudioContext,
    masterGainNode: GainNode,
    options?: Partial<SquareWaveOptions>
  ) {
    this.context = context;

    if (options) {
      if (options.dutyCycle) this.dutyCycle = options.dutyCycle;
      if (options.frequency) this.frequency = options.frequency;
      if (options.volume) this.volume = options.volume;
    }

    // Create a sawtooth oscillator from which to generate the square wave
    this.source = new OscillatorNode(this.context, {
      type: "sawtooth",
      frequency: this.frequency,
    });

    // Create a waveshaper to convert the sawtooth wave to a square wave
    this.waveshaper = new WaveShaperNode(this.context, {
      curve: getWaveShaperCurve(this.dutyCycle),
    });

    // Create a gain node to control for this specific square wave
    this.gainNode = new GainNode(this.context, { gain: this.volume });

    // Connect the nodes (outputs to master gain node which outputs to destination)
    this.source
      .connect(this.waveshaper)
      .connect(this.gainNode)
      .connect(masterGainNode);
  }

  public scheduleAudio(startTime: number, row: PulseRow) {
    this.source.frequency.setValueAtTime(getFrequency(row.note), startTime);
    this.gainNode.gain.setValueAtTime(getVolume(row.volume), startTime);
  }

  public scheduleStartAndStop(startTime: number, stopTime: number) {
    this.source.start(startTime);
    this.source.stop(stopTime);
  }
}
