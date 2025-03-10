import { EventEmitter } from "events";
import { ROWS_PER_BEAT, ROWS_PER_PATTERN } from "./constants";
import { SquareWave } from "./square-wave";
import { Pattern } from "./patterns";
import { getFrequency, Note, MusicalNote } from "./notes";
import { getVolume } from "./volume";

/**
 * A tracker for a music sequencer that keeps track of the tempo and timing of the music.
 */
export class Tracker extends EventEmitter {
  // private rowDuration: number; // row duration in seconds
  private audioContext: AudioContext;
  private masterGainNode: GainNode;

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
    // Create the pulse waves
    const pulse1 = new SquareWave(this.audioContext, this.masterGainNode, {
      dutyCycle: 0.5,
      volume: 1,
    });
    const pulse2 = new SquareWave(this.audioContext, this.masterGainNode, {
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

      pulse1.scheduleAudio(t, pulse1Row);
      pulse2.scheduleAudio(t, pulse2Row);

      // // Schedule the pulse1 row
      // if (pulse1Row.note === "OFF") {
      //   pulse1.source.frequency.setValueAtTime(0, t);
      //   pulse1.gainNode.gain.setValueAtTime(0, t);
      // }
      // // handle continue
      // else if (pulse1Row.note === "---") {
      //   // do nothing
      // }
      // // handle note
      // else {
      //   pulse1.source.frequency.setValueAtTime(getFrequency(pulse1Row.note), t);
      //   pulse1.gainNode.gain.setValueAtTime(getVolume(pulse1Row.volume), t);
      // }

      // // Schedule the pulse2 row
      // if (pulse2Row.note === "OFF") {
      //   pulse2.source.frequency.setValueAtTime(0, t);
      //   pulse2.gainNode.gain.setValueAtTime(0, t);
      // }
      // // handle continue
      // else if (pulse2Row.note === "---") {
      //   // do nothing
      // }
      // // handle note
      // else {
      //   pulse2.source.frequency.setValueAtTime(getFrequency(pulse2Row.note), t);
      //   pulse2.gainNode.gain.setValueAtTime(getVolume(pulse2Row.volume), t);
      // }
    }

    pulse1.scheduleStartAndStop(startTime, stopTime);
    pulse2.scheduleStartAndStop(startTime, stopTime);
  }
}

// Create a single instance of the tracker
export const tracker = new Tracker();
