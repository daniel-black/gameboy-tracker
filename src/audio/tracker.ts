import { EventEmitter } from "events";
import { ROWS_PER_BEAT, ROWS_PER_PATTERN } from "./constants";
import { SquareWave } from "./square-wave";
import { Pattern } from "./patterns";
import { getFrequency } from "./notes";
import { getVolume } from "./volume";

/**
 * A tracker for a music sequencer that keeps track of the tempo and timing of the music.
 */
export class Tracker extends EventEmitter {
  private audioContext: AudioContext;
  private masterGainNode: GainNode;
  private pulse1: SquareWave | null = null;
  private pulse2: SquareWave | null = null;

  constructor() {
    super(); // call the EventEmitter constructor

    this.audioContext = new AudioContext();

    // Create a master gain node & connect it to the audio context destination
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
  }

  public playPattern({
    beatsPerMinute,
    pattern,
  }: {
    beatsPerMinute: number;
    pattern: Pattern;
  }) {
    // if there is an existing pattern playing, stop it
    if (this.pulse1) this.pulse1.source.stop(this.audioContext.currentTime);
    if (this.pulse2) this.pulse2.source.stop(this.audioContext.currentTime);

    // Create the pulse waves
    this.pulse1 = new SquareWave(this.audioContext, this.masterGainNode, {
      dutyCycle: 0.5,
      volume: 1,
    });
    this.pulse2 = new SquareWave(this.audioContext, this.masterGainNode, {
      dutyCycle: 0.5,
      volume: 1,
    });

    // timing variables
    const rowDuration = 60 / beatsPerMinute / ROWS_PER_BEAT; // seconds
    const startTime = this.audioContext.currentTime;
    const stopTime = startTime + ROWS_PER_PATTERN * rowDuration;

    // schedule the rows for each channel
    for (let rowIndex = 0; rowIndex < ROWS_PER_PATTERN; rowIndex++) {
      const t = startTime + rowIndex * rowDuration;

      const pulse1Row = pattern.pulse1[rowIndex];
      const pulse2Row = pattern.pulse2[rowIndex];

      if (pulse1Row.note === "OFF") {
        this.pulse1.source.frequency.setValueAtTime(0, t);
        this.pulse1.gainNode.gain.setValueAtTime(0, t);
      } else if (pulse1Row.note === "---") {
        // play the previous note that was not "OFF" or "---"
        // do apply volume though
        this.pulse1.gainNode.gain.setValueAtTime(
          getVolume(pulse1Row.volume),
          t
        );
      } else {
        this.pulse1.source.frequency.setValueAtTime(
          getFrequency(pulse1Row.note),
          t
        );
        this.pulse1.gainNode.gain.setValueAtTime(
          getVolume(pulse1Row.volume),
          t
        );
      }

      if (pulse2Row.note === "OFF") {
        this.pulse2.source.frequency.setValueAtTime(0, t);
        this.pulse2.gainNode.gain.setValueAtTime(0, t);
      } else if (pulse2Row.note === "---") {
        this.pulse2.gainNode.gain.setValueAtTime(
          getVolume(pulse2Row.volume),
          t
        );
      } else {
        this.pulse2.source.frequency.setValueAtTime(
          getFrequency(pulse2Row.note),
          t
        );
        this.pulse2.gainNode.gain.setValueAtTime(
          getVolume(pulse2Row.volume),
          t
        );
      }
    }

    this.pulse1.scheduleStartAndStop(startTime, stopTime);
    this.pulse2.scheduleStartAndStop(startTime, stopTime);
  }

  public stopPlayback() {
    const now = this.audioContext.currentTime;
    if (this.pulse1) {
      this.pulse1.source.stop(now + 0.01); // Stop in 10ms to avoid glitches
      this.pulse1 = null;
    }
    if (this.pulse2) {
      this.pulse2.source.stop(now + 0.01);
      this.pulse2 = null;
    }
    this.emit("playbackStopped");
  }
}

// Create a single instance of the tracker
export const tracker = new Tracker();
