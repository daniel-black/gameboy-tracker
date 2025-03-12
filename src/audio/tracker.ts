import { EventEmitter } from "events";
import { ROWS_PER_BEAT, ROWS_PER_PATTERN } from "./constants";
import { SquareWave } from "./square-wave";
import { Pattern } from "./patterns";
import { getFrequency } from "./notes";
import { getVolume } from "./volume";

export const EVENT = {
  PLAYBACK_STARTED: "playbackStarted",
  PLAYBACK_STOPPED: "playbackStopped",
  PLAYBACK_PAUSED: "playbackPaused",
  PLAYBACK_RESUMED: "playbackResumed",
  CURRENT_ROW_CHANGED: "currentRowChanged",
  LOOPING_CHANGED: "loopingChanged",
} as const;

/**
 * A tracker for a music sequencer that keeps track of the tempo and timing of the music.
 */
export class Tracker extends EventEmitter {
  private audioContext: AudioContext;
  private masterGainNode: GainNode;
  private pulse1: SquareWave | null = null;
  private pulse2: SquareWave | null = null;

  private rowDuration: number = 0;
  private startTime: number = 0;
  private pauseTime: number = 0;
  private isPaused: boolean = false;
  private isLooping: boolean = false;
  private currentRow: number = 0;
  private animationFrameId: number | null = null;
  private pattern: Pattern | null = null;
  private beatsPerMinute: number = 120;

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
    loop = false,
  }: {
    beatsPerMinute: number;
    pattern: Pattern;
    loop?: boolean;
  }) {
    // Save pattern and BPM for potential later resuming
    this.pattern = pattern;
    this.beatsPerMinute = beatsPerMinute;
    this.isLooping = loop;

    // Reset pause state
    this.isPaused = false;

    // Calculate timing
    this.rowDuration = 60 / beatsPerMinute / ROWS_PER_BEAT; // seconds

    // Determine if we're resuming or starting fresh
    const isResuming = this.pauseTime > 0;

    if (isResuming) {
      // When resuming, adjust the startTime to maintain proper timing
      this.startTime = this.audioContext.currentTime - this.pauseTime;
    } else {
      // We're starting fresh
      this.startTime = this.audioContext.currentTime;
      this.currentRow = 0;
    }

    const patternDuration = ROWS_PER_PATTERN * this.rowDuration;
    const stopTime = this.startTime + patternDuration;

    // if there are existing oscillators playing, stop them
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

    // First, find the most recent non-OFF/--- notes for continuing patterns
    let lastPulse1Note = null;
    let lastPulse1Freq = 0;
    let lastPulse2Note = null;
    let lastPulse2Freq = 0;

    if (isResuming) {
      // When resuming, we need to know the last active note for each channel
      for (let i = 0; i < this.currentRow; i++) {
        const p1 = pattern.pulse1[i];
        const p2 = pattern.pulse2[i];

        if (p1.note !== "OFF" && p1.note !== "---") {
          lastPulse1Note = p1.note;
          lastPulse1Freq = getFrequency(p1.note);
        }

        if (p2.note !== "OFF" && p2.note !== "---") {
          lastPulse2Note = p2.note;
          lastPulse2Freq = getFrequency(p2.note);
        }
      }
    }

    // If resuming, immediately set the oscillator to the correct frequency
    if (isResuming && lastPulse1Freq > 0) {
      this.pulse1.source.frequency.setValueAtTime(
        lastPulse1Freq,
        this.audioContext.currentTime
      );
      this.pulse1.gainNode.gain.setValueAtTime(
        getVolume(pattern.pulse1[this.currentRow - 1].volume),
        this.audioContext.currentTime
      );
    }

    if (isResuming && lastPulse2Freq > 0) {
      this.pulse2.source.frequency.setValueAtTime(
        lastPulse2Freq,
        this.audioContext.currentTime
      );
      this.pulse2.gainNode.gain.setValueAtTime(
        getVolume(pattern.pulse2[this.currentRow - 1].volume),
        this.audioContext.currentTime
      );
    }

    // Schedule the rows for each channel, starting from the current row if resuming
    for (let rowIndex = 0; rowIndex < ROWS_PER_PATTERN; rowIndex++) {
      // Skip scheduling rows that have already played when resuming
      if (isResuming && rowIndex < this.currentRow) {
        continue;
      }

      const t = this.startTime + rowIndex * this.rowDuration;
      const pulse1Row = pattern.pulse1[rowIndex];
      const pulse2Row = pattern.pulse2[rowIndex];

      // Handle pulse 1 channel
      if (pulse1Row.note === "OFF") {
        this.pulse1.source.frequency.setValueAtTime(0, t);
        this.pulse1.gainNode.gain.setValueAtTime(0, t);
      } else if (pulse1Row.note === "---") {
        // Only adjust volume for continuing notes
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

      // Handle pulse 2 channel
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

    this.pulse1.scheduleStartAndStop(this.audioContext.currentTime, stopTime);
    this.pulse2.scheduleStartAndStop(this.audioContext.currentTime, stopTime);

    // Reset pauseTime after we've used it
    this.pauseTime = 0;

    // Start tracking the current row
    this.startRowTracking();

    // Emit appropriate event
    if (isResuming) {
      this.emit(EVENT.PLAYBACK_RESUMED);
    } else {
      this.emit(EVENT.PLAYBACK_RESUMED);
    }
  }

  /**
   * Pause the current playback
   */
  public pausePlayback() {
    if (!this.isPaused && this.pulse1 && this.pulse2) {
      this.isPaused = true;

      // Calculate how far we are into the pattern
      this.pauseTime = this.audioContext.currentTime - this.startTime;

      // Make sure the current row is accurately set based on elapsed time
      const elapsedBeats = this.pauseTime / this.rowDuration;
      this.currentRow = Math.floor(elapsedBeats) % ROWS_PER_PATTERN;

      // Stop the audio
      const now = this.audioContext.currentTime;
      this.pulse1.source.stop(now + 0.01);
      this.pulse2.source.stop(now + 0.01);

      // Stop the animation frame
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      this.emit(EVENT.PLAYBACK_PAUSED);
    }
  }

  /**
   * Resume playback from where it was paused
   */
  public resumePlayback() {
    if (this.isPaused && this.pattern) {
      this.playPattern({
        beatsPerMinute: this.beatsPerMinute,
        pattern: this.pattern,
        loop: this.isLooping,
      });

      this.emit(EVENT.PLAYBACK_RESUMED);
    }
  }

  /**
   * Toggle looping on or off
   */
  public setLooping(loop: boolean) {
    this.isLooping = loop;
    this.emit(EVENT.LOOPING_CHANGED, loop);
  }

  /**
   * Stop playback completely
   */
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

    // Reset state
    this.isPaused = false;
    this.pauseTime = 0;
    this.currentRow = 0;

    // Stop animation frame
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.emit(EVENT.PLAYBACK_STOPPED);
  }

  /**
   * Return the current playback state
   */
  public getPlaybackState() {
    return {
      isPlaying: this.pulse1 !== null && !this.isPaused,
      isPaused: this.isPaused,
      isLooping: this.isLooping,
      currentRow: this.currentRow,
    };
  }

  /**
   * Start tracking which row is currently playing and emit events
   */
  private startRowTracking() {
    // Cancel any existing animation frame
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const updateRow = () => {
      if (this.isPaused) return;

      const elapsedTime = this.audioContext.currentTime - this.startTime;
      const currentRow =
        Math.floor(elapsedTime / this.rowDuration) % ROWS_PER_PATTERN;

      // If we've moved to a new row, emit an event
      if (currentRow !== this.currentRow) {
        this.currentRow = currentRow;
        this.emit(EVENT.CURRENT_ROW_CHANGED, currentRow);
      }

      // If we've reached the end, either stop or loop
      if (elapsedTime >= ROWS_PER_PATTERN * this.rowDuration) {
        if (this.isLooping) {
          // For looping, we adjust startTime to create continuous playback
          this.startTime = this.audioContext.currentTime;

          // Reschedule notes for the next loop
          if (this.pattern) {
            this.playPattern({
              beatsPerMinute: this.beatsPerMinute,
              pattern: this.pattern,
              loop: true,
            });
          }
        } else {
          this.stopPlayback();
          return; // Exit the animation frame loop
        }
      }

      // Continue tracking
      this.animationFrameId = requestAnimationFrame(updateRow);
    };

    // Start the animation frame loop
    this.animationFrameId = requestAnimationFrame(updateRow);
  }
}

// Create a single instance of the tracker
export const tracker = new Tracker();
