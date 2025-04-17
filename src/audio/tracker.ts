import { nanoid } from "nanoid";
import {
  CHANNELS,
  DEFAULT_BPM,
  MAX_PATTERNS,
  ROWS_PER_BEAT,
  ROWS_PER_PATTERN,
} from "./constants";
import {
  createDefaultPulse1Cell,
  createDefaultPulse2Cell,
  createDefaultNoiseCell,
  createDefaultWaveCell,
  NoiseCell,
  Pulse1Cell,
  Pulse2Cell,
  WaveCell,
  Cell,
} from "./cell";
import { TypedEventEmitter } from "./typed-event-emmiter";
import { getWaveShaperCurve } from "./wave-shaper";
import { TrackerEventMap } from "./events";
import { ChannelType, Channels, Pattern, PatternMetadata } from "./types";
import { getFrequency } from "./notes";
import {
  getVolume,
  getWaveVolume,
  WAVE_VOLUME_KEYS,
  waveVolumeMap,
} from "./volume";
import { getRate } from "./rate";
import { getDutyCycle } from "./duty-cycle";
import { getWaveForm } from "./wave-form";
import { isContinue } from "./utils";

/**
 * A tracker for a music sequencer that keeps track of the tempo and timing of the music.
 */
export class Tracker {
  // Audio Context and master volume
  private ctx: AudioContext;
  private masterGainNode: GainNode;

  // Audio channels
  private channels: Channels;

  // Pattern state
  private patterns: Map<string, Pattern>;
  private patternOrder: Array<string>;
  private currentPatternId: string;

  // Playback state
  private bpm: number;
  private isPlaying: boolean;
  private isPaused: boolean;
  private currentPlaybackRow: number;
  private currentPlaybackPatternIndex: number;
  private lookaheadTime: number;
  private scheduleIntervalTime: number;
  private scheduleIntervalId: number | null;
  private nextNoteTime: number;
  private startRow: number;
  private endRow: number;
  private startPatternIndex: number;
  private endPatternIndex: number;
  private isLooping: boolean;

  private sourcesStarted: boolean;

  // Emitter to let the UI know what's up
  public emitter: TypedEventEmitter<TrackerEventMap>;

  constructor() {
    this.ctx = new AudioContext();

    // Create a master gain node & connect it to the audio context destination
    this.masterGainNode = this.ctx.createGain();
    this.masterGainNode.connect(this.ctx.destination);

    // Create buffer for noise channel
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const bufferData = buffer.getChannelData(0);

    // Initialize LFSR with all bits set to 1 (as GameBoy does)
    let lfsr = 0x7fff;

    // Fill the buffer with noise generated using LFSR
    for (let i = 0; i < bufferSize; i++) {
      // Get output bit (bit 0)
      const output = lfsr & 1;

      // Scale to [-1, 1] for audio (0 becomes -1, 1 becomes 1)
      bufferData[i] = output * 2 - 1;

      // Shift LFSR and apply feedback
      // XOR bits 0 and 1
      const bit0 = lfsr & 1;
      const bit1 = (lfsr >> 1) & 1;
      const newBit = bit0 ^ bit1;

      // Shift right by 1 and put new bit in position 15
      lfsr = (lfsr >> 1) | (newBit << 14);
    }

    // Create the channels
    this.channels = {
      pulse1: {
        source: new OscillatorNode(this.ctx, { type: "sawtooth" }),
        waveShaper: new WaveShaperNode(this.ctx, {
          curve: getWaveShaperCurve(0.5),
        }),
        gainNode: new GainNode(this.ctx, { gain: 0 }),
        gate: new GainNode(this.ctx, { gain: 1 }),
      },
      pulse2: {
        source: new OscillatorNode(this.ctx, { type: "sawtooth" }),
        waveShaper: new WaveShaperNode(this.ctx, {
          curve: getWaveShaperCurve(0.5),
        }),
        gainNode: new GainNode(this.ctx, { gain: 0 }),
        gate: new GainNode(this.ctx, { gain: 1 }),
      },
      wave: {
        source: new OscillatorNode(this.ctx, { type: "sine" }),
        gainNode: new GainNode(this.ctx, { gain: 0 }),
        gate: new GainNode(this.ctx, { gain: 1 }),
      },
      noise: {
        source: new AudioBufferSourceNode(this.ctx, { buffer, loop: true }),
        gainNode: new GainNode(this.ctx, { gain: 0 }),
        gate: new GainNode(this.ctx, { gain: 1 }),
      },
    };

    // Configure the channels and connect the audio nodes
    this.channels.pulse1.source.connect(this.channels.pulse1.waveShaper);
    this.channels.pulse1.waveShaper.connect(this.channels.pulse1.gainNode);
    this.channels.pulse1.gainNode.connect(this.channels.pulse1.gate);
    this.channels.pulse1.gate.connect(this.masterGainNode);

    this.channels.pulse2.source.connect(this.channels.pulse2.waveShaper);
    this.channels.pulse2.waveShaper.connect(this.channels.pulse2.gainNode);
    this.channels.pulse2.gainNode.connect(this.channels.pulse2.gate);
    this.channels.pulse2.gate.connect(this.masterGainNode);

    this.channels.wave.source.connect(this.channels.wave.gainNode);
    this.channels.wave.gainNode.connect(this.channels.wave.gate);
    this.channels.wave.gate.connect(this.masterGainNode);

    this.channels.noise.source.connect(this.channels.noise.gainNode);
    this.channels.noise.gainNode.connect(this.channels.noise.gate);
    this.channels.noise.gate.connect(this.masterGainNode);

    // Set up patterns
    const initialPattern = this.createNewPattern("Pattern 1");
    this.patterns = new Map<string, Pattern>();
    this.patterns.set(initialPattern.id, initialPattern);
    this.patternOrder = [initialPattern.id];
    this.currentPatternId = initialPattern.id;

    // Set up playback state
    this.bpm = DEFAULT_BPM;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentPlaybackRow = 0;
    this.currentPlaybackPatternIndex = 0; // different from currentPatternId - this refers to the index in the patternOrder array
    this.lookaheadTime = 0.1; // 100ms
    this.scheduleIntervalTime = 50; // ms between scheduling events
    this.scheduleIntervalId = null;
    this.nextNoteTime = 0;
    this.startRow = 0;
    this.endRow = ROWS_PER_PATTERN - 1;
    this.startPatternIndex = 0;
    this.endPatternIndex = 0;
    this.isLooping = false;

    // Set up event emitter
    this.emitter = new TypedEventEmitter<TrackerEventMap>();

    this.sourcesStarted = false;
  }

  /**
   * Gets the current beats per minute of the tracker
   * @returns The current BPM
   */
  public getBpm() {
    return this.bpm;
  }

  /**
   * Sets the beats per minute of the tracker and emits a `changedBpm` event
   * @param bpm The new BPM to set
   */
  public setBpm(bpm: number) {
    this.bpm = bpm;
    this.emitter.emit("changedBpm", { bpm });
  }

  private createNewPattern(name?: string): Pattern {
    return {
      name: name || `Pattern ${this.patterns.size + 1}`,
      id: nanoid(4),
      cells: {
        pulse1: Array.from({ length: ROWS_PER_PATTERN }, () =>
          createDefaultPulse1Cell()
        ),
        pulse2: Array.from({ length: ROWS_PER_PATTERN }, () =>
          createDefaultPulse2Cell()
        ),
        wave: Array.from({ length: ROWS_PER_PATTERN }, () =>
          createDefaultWaveCell()
        ),
        noise: Array.from({ length: ROWS_PER_PATTERN }, () =>
          createDefaultNoiseCell()
        ),
      },
    };
  }

  /**
   * Sets the current pattern to a specific pattern by id and emits a `changedCurrentPattern` event
   * @param id The id of the pattern to set as the current pattern
   */
  public setCurrentPatternId(id: string) {
    this.currentPatternId = id;
    this.emitter.emit("changedCurrentPattern", { patternId: id });
  }

  public deletePattern(id: string) {
    this.patterns.delete(id);
    this.patternOrder = this.patternOrder.filter(
      (patternId) => patternId !== id
    );
  }

  public addPattern() {
    if (this.patterns.size >= MAX_PATTERNS) {
      return;
    }

    const newPattern = this.createNewPattern();

    this.patterns.set(newPattern.id, newPattern);
    this.patternOrder.push(newPattern.id);
    this.currentPatternId = newPattern.id;

    this.emitter.emit("changedCurrentPattern", { patternId: newPattern.id });
  }

  /**
   * Gets whether a channel is enabled or not
   * @param channel Either "pulse1", "pulse2", "wave", or "noise"
   * @returns A boolean indicating whether the channel is enabled
   */
  public getIsChannelEnabled(channel: ChannelType) {
    return this.channels[channel].gate.gain.value === 1;
  }

  /**
   * Toggles a channel on or off and emits a `toggledChannel` event
   * @param channel Either "pulse1", "pulse2", "wave", or "noise"
   */
  public toggleChannel(channel: ChannelType) {
    const isEnabled = this.getIsChannelEnabled(channel);
    this.channels[channel].gate.gain.value = isEnabled ? 0 : 1;
    this.emitter.emit("toggledChannel", { channel, enabled: !isEnabled });
  }

  public getCurrentPattern() {
    const currentPattern = this.patterns.get(this.getCurrentPatternId());
    if (!currentPattern) {
      throw new Error("no current pattern");
    }

    return currentPattern;
  }

  private getPatternMetadata(patternId: string): PatternMetadata {
    const pattern = this.getPatternById(patternId);
    if (!pattern) {
      throw new Error("pattern not found");
    }

    return {
      id: pattern.id,
      name: pattern.name,
    };
  }

  public getAllPatternsMetadata() {
    return this.patternOrder.map((patternId) =>
      this.getPatternMetadata(patternId)
    );
  }

  public getCurrentPatternId() {
    return this.currentPatternId;
  }

  public getCell<T extends ChannelType>(channel: T, row: number) {
    return this.getCurrentPattern().cells[channel][row] as Cell[T];
  }

  public setCell<T extends ChannelType>(
    channel: T,
    row: number,
    newCell: Cell[T]
  ) {
    this.getCurrentPattern().cells[channel][row] = newCell;
    this.emitter.emit("changedCell", { channel, row });
  }

  private startAllSources() {
    this.channels.pulse1.source.start();
    this.channels.pulse2.source.start();
    this.channels.wave.source.start();
    this.channels.noise.source.start();
    this.sourcesStarted = true; // Prevent starting the sources multiple times
  }

  public async play(
    options: {
      startPatternIndex?: number;
      endPatternIndex?: number;
      startRow?: number;
      endRow?: number;
    } = {}
  ) {
    if (!this.sourcesStarted) {
      this.startAllSources();
    }

    if (this.isPaused) {
      await this.resume();
      return;
    }

    if (this.isPlaying) {
      await this.stop();
    }

    try {
      if (this.ctx.state === "suspended") await this.ctx.resume();

      const maxPatternIndex = this.patternOrder.length - 1;
      this.startPatternIndex = Math.max(
        0,
        Math.min(options.startPatternIndex ?? 0, maxPatternIndex)
      );
      this.endPatternIndex = Math.max(
        this.startPatternIndex,
        Math.min(options.endPatternIndex ?? maxPatternIndex, maxPatternIndex)
      );
      this.startRow = Math.max(
        0,
        Math.min(options.startRow ?? 0, ROWS_PER_PATTERN - 1)
      );
      this.endRow = Math.max(
        this.startRow,
        Math.min(options.endRow ?? ROWS_PER_PATTERN - 1, ROWS_PER_PATTERN - 1)
      );
      this.currentPlaybackPatternIndex = this.startPatternIndex;
      this.currentPlaybackRow = this.startRow;
      this.isPlaying = true;
      this.isPaused = false;
      this.nextNoteTime = this.ctx.currentTime;

      // Start the scheduler
      this.scheduleIntervalId = window.setInterval(
        () => this.scheduler(),
        this.scheduleIntervalTime
      );

      // Notify listeners
      this.emitter.emit("startedPlayback", {
        row: this.currentPlaybackRow,
        patternId: this.getCurrentPatternId(),
      });
    } catch (error) {
      console.error("Error starting playback:", error);
      this.isPlaying = false;
      this.isPaused = false;
    }
  }

  private calculateSecondsPerRow(): number {
    return 60 / (this.bpm * ROWS_PER_BEAT);
  }

  /**
   * Scheduler function that queues up notes to play
   */
  private scheduler() {
    // Schedule notes until we're a bit ahead of current time
    while (this.nextNoteTime < this.ctx.currentTime + this.lookaheadTime) {
      // Schedule the current row
      this.scheduleRow(this.nextNoteTime);

      // Move to next row
      this.advancePlayhead();

      // Calculate the time for the next row
      this.nextNoteTime += this.calculateSecondsPerRow();
    }
  }

  /**
   * Schedule audio events for the current row at the specified time
   */
  private scheduleRow(time: number) {
    const currentPlaybackPattern = this.getPatternById(
      this.patternOrder[this.currentPlaybackPatternIndex]
    );
    if (!currentPlaybackPattern) return;

    // Schedule each channel for this row
    this.schedulePulse1Channel(
      time,
      currentPlaybackPattern.cells.pulse1[this.currentPlaybackRow]
    );
    this.schedulePulse2Channel(
      time,
      currentPlaybackPattern.cells.pulse2[this.currentPlaybackRow]
    );
    this.scheduleWaveChannel(
      time,
      currentPlaybackPattern.cells.wave[this.currentPlaybackRow]
    );
    this.scheduleNoiseChannel(
      time,
      currentPlaybackPattern.cells.noise[this.currentPlaybackRow]
    );

    // Emit an event so the UI can update
    this.emitter.emit("changedPlaybackRow", {
      row: this.currentPlaybackRow,
      patternId: currentPlaybackPattern.id,
      time,
    });
  }

  private scheduleVolumeEnvelope(
    gainNode: GainNode,
    initialVolumeString: string,
    envelopeString: string,
    time: number,
    isWaveChannel: boolean
  ) {
    if (isContinue(envelopeString)) {
      return;
    }

    const directionChar = envelopeString[0];
    const stepChar = envelopeString[1];

    if (
      !["0", "1"].includes(directionChar) ||
      !["1", "2", "3", "4", "5", "6", "7"].includes(stepChar)
    ) {
      return;
    }

    const isIncreasing = directionChar === "1";
    const stepSpeed = parseInt(stepChar, 10);
    const rowDuration = this.calculateSecondsPerRow();
    const numStepsInRow = Math.min(8 - stepSpeed, 7); // max 7 steps
    const stepDuration = rowDuration / numStepsInRow;
    let currentVolume = parseInt(initialVolumeString, 10);

    // wave envelope still a little broken i think
    if (isWaveChannel) {
      let currentVolumeIndex = waveVolumeMap.get(initialVolumeString) || 0;

      for (let i = 0; i < numStepsInRow; i++) {
        const stepTime = time + (i + 1) * stepDuration;

        // Calculate next volume level based on direction
        if (isIncreasing) {
          currentVolumeIndex = Math.min(3, currentVolumeIndex + 1);
        } else {
          currentVolumeIndex = Math.max(0, currentVolumeIndex - 1);
        }

        // Get the wave volume string for this index
        const volumeString = WAVE_VOLUME_KEYS[currentVolumeIndex];
        const volumeValue = getWaveVolume(volumeString);
        console.log(`volume: ${volumeValue} at ${stepTime}`);

        // Apply the volume change
        gainNode.gain.setValueAtTime(volumeValue, stepTime);

        // Stop if we've reached the volume limit
        if (currentVolumeIndex === 0 || currentVolumeIndex === 3) {
          break;
        }
      }

      return;
    }

    for (let i = 0; i < numStepsInRow; i++) {
      const stepTime = time + (i + 1) * stepDuration;

      // Calculate next volume level based on direction
      if (isIncreasing) {
        currentVolume = Math.min(15, currentVolume + 1);
      } else {
        currentVolume = Math.max(0, currentVolume - 1);
      }

      // Apply the volume change
      const volumeValue = getVolume(currentVolume.toString());
      gainNode.gain.setValueAtTime(volumeValue, stepTime);

      // Stop if we've reached the volume limit
      if (currentVolume === 0 || currentVolume === 15) {
        break;
      }
    }
  }

  private schedulePulse1Channel(time: number, cell: Pulse1Cell) {
    // skip scheduling if the channel is disabled
    if (!this.getIsChannelEnabled("pulse1")) {
      return;
    }

    if (!isContinue(cell.note)) {
      this.channels.pulse1.source.frequency.setValueAtTime(
        getFrequency(cell.note),
        time
      );
    }

    if (!isContinue(cell.volume)) {
      // cancel any previous envelope automation
      this.channels.pulse1.gainNode.gain.cancelScheduledValues(time);
      this.channels.pulse1.gainNode.gain.setValueAtTime(
        getVolume(cell.volume),
        time
      );

      if (!isContinue(cell.envelope)) {
        this.scheduleVolumeEnvelope(
          this.channels.pulse1.gainNode,
          cell.volume,
          cell.envelope,
          time,
          false
        );
      }
    }

    if (!isContinue(cell.dutyCycle)) {
      this.channels.pulse1.waveShaper.curve = getWaveShaperCurve(
        getDutyCycle(cell.dutyCycle)
      );
    }
  }

  private schedulePulse2Channel(time: number, cell: Pulse2Cell) {
    // skip scheduling if the channel is disabled
    if (!this.getIsChannelEnabled("pulse2")) {
      return;
    }

    if (!isContinue(cell.note)) {
      this.channels.pulse2.source.frequency.setValueAtTime(
        getFrequency(cell.note),
        time
      );
    }

    if (!isContinue(cell.volume)) {
      this.channels.pulse2.gainNode.gain.setValueAtTime(
        getVolume(cell.volume),
        time
      );
    }

    if (!isContinue(cell.dutyCycle)) {
      this.channels.pulse2.waveShaper.curve = getWaveShaperCurve(
        getDutyCycle(cell.dutyCycle)
      );
    }
  }

  private scheduleWaveChannel(time: number, cell: WaveCell) {
    // skip scheduling if the channel is disabled
    if (!this.getIsChannelEnabled("wave")) {
      return;
    }

    if (!isContinue(cell.note)) {
      this.channels.wave.source.frequency.setValueAtTime(
        getFrequency(cell.note),
        time
      );
    }

    if (!isContinue(cell.volume)) {
      this.channels.wave.gainNode.gain.cancelScheduledValues(time);
      this.channels.wave.gainNode.gain.setValueAtTime(
        getWaveVolume(cell.volume),
        time
      );

      if (!isContinue(cell.envelope)) {
        this.scheduleVolumeEnvelope(
          this.channels.wave.gainNode,
          cell.volume,
          cell.envelope,
          time,
          true
        );
      }
    }

    if (!isContinue(cell.waveForm)) {
      this.channels.wave.source.type = getWaveForm(cell.waveForm);
    }
  }

  private scheduleNoiseChannel(time: number, cell: NoiseCell) {
    if (!this.getIsChannelEnabled("noise")) {
      return;
    }

    if (!isContinue(cell.rate)) {
      this.channels.noise.source.playbackRate.setValueAtTime(
        getRate(cell.rate),
        time
      );
    }

    if (!isContinue(cell.volume)) {
      this.channels.noise.gainNode.gain.cancelScheduledValues(time);
      this.channels.noise.gainNode.gain.setValueAtTime(
        getVolume(cell.volume),
        time
      );

      if (!isContinue(cell.envelope)) {
        this.scheduleVolumeEnvelope(
          this.channels.noise.gainNode,
          cell.volume,
          cell.envelope,
          time,
          false
        );
      }
    }
  }

  /**
   * Advance the playhead to the next row, handling pattern changes and looping
   */
  private advancePlayhead() {
    this.currentPlaybackRow++;

    // Check if we've reached the end of the current pattern's rows
    if (this.currentPlaybackRow > this.endRow) {
      // Move to the next pattern if there is one
      if (this.currentPlaybackPatternIndex < this.endPatternIndex) {
        this.currentPlaybackPatternIndex++;
        this.currentPlaybackRow = 0; // Start at the beginning of the next pattern
        this.emitter.emit("changedCurrentPattern", {
          patternId: this.patternOrder[this.currentPlaybackPatternIndex],
        });
      } else {
        // We've reached the end of playback
        if (this.isLooping) {
          // Loop back to start
          this.currentPlaybackPatternIndex = this.startPatternIndex;
          this.currentPlaybackRow = this.startRow;
        } else {
          // End playback
          this.stopScheduler();
          this.silenceAllChannels();
          this.emitter.emit("stoppedPlayback", {
            row: this.currentPlaybackRow,
            patternId: this.patternOrder[this.currentPlaybackPatternIndex],
          });
          return;
        }
      }
    }
  }

  /**
   * Pause playback
   */
  public async pause() {
    if (!this.isPlaying || this.isPaused) return;

    this.stopScheduler();

    try {
      // Now wait for the audio context to fully suspend
      await this.ctx.suspend();

      this.isPaused = true;

      this.emitter.emit("pausedPlayback", {
        row: this.currentPlaybackRow,
        patternId: this.patternOrder[this.currentPlaybackPatternIndex],
      });
    } catch (error) {
      console.error("Error suspending audio context:", error);
      // If suspending fails, try to maintain a consistent state
      this.isPaused = false;
      this.isPlaying = true;

      // Restart the scheduler if there was an error
      this.scheduleIntervalId = window.setInterval(
        () => this.scheduler(),
        this.scheduleIntervalTime
      );
    }
  }

  /**
   * Resume paused playback
   */
  public async resume() {
    if (!this.isPaused) return;

    try {
      // Wait for the audio context to fully resume
      await this.ctx.resume();

      this.isPaused = false;
      this.isPlaying = true;

      // Recalculate the nextNoteTime from the current time
      this.nextNoteTime = this.ctx.currentTime;

      // Start the scheduler again
      this.scheduleIntervalId = window.setInterval(
        () => this.scheduler(),
        this.scheduleIntervalTime
      );

      this.emitter.emit("resumedPlayback", {
        row: this.currentPlaybackRow,
        patternId: this.patternOrder[this.currentPlaybackPatternIndex],
      });
    } catch (error) {
      console.error("Error resuming audio context:", error);
      // If resuming fails, maintain consistent state
      this.isPaused = true;
    }
  }

  /**
   * Stop playback completely
   */
  public async stop() {
    if (!this.isPlaying && !this.isPaused) return;

    const row = this.currentPlaybackRow;
    const patternId = this.patternOrder[this.currentPlaybackPatternIndex];

    this.isPaused = false;

    // Stop the scheduler
    this.stopScheduler();

    // Silence all channels
    this.silenceAllChannels();

    // Reset playback position
    this.currentPlaybackRow = this.startRow;
    this.currentPlaybackPatternIndex = this.startPatternIndex;

    this.emitter.emit("stoppedPlayback", { row, patternId });
  }

  /**
   * Helper to stop the scheduling interval
   */
  private stopScheduler() {
    if (this.scheduleIntervalId !== null) {
      clearInterval(this.scheduleIntervalId);
      this.scheduleIntervalId = null;
    }
    this.isPlaying = false;
  }

  private silenceAllChannels() {
    CHANNELS.forEach((channel) => {
      // Cancel any scheduled future volume changes
      this.channels[channel].gainNode.gain.cancelScheduledValues(
        this.ctx.currentTime
      );

      // Set gain to 0 for all channels
      this.channels[channel].gainNode.gain.setValueAtTime(
        0,
        this.ctx.currentTime
      );

      // cancel scheduled values for oscillator node sources
      if (channel !== "noise") {
        this.channels[channel].source.frequency.cancelScheduledValues(
          this.ctx.currentTime
        );

        this.channels[channel].source.frequency.setValueAtTime(
          0,
          this.ctx.currentTime
        );
      }
    });
  }

  private getPatternById(id: string): Pattern | undefined {
    return this.patterns.get(id);
  }

  /**
   * Play the current pattern only
   */
  public async playCurrentPattern(
    options: { startRow?: number; endRow?: number } = {}
  ) {
    const currentPlaybackPatternIndex = this.patternOrder.indexOf(
      this.getCurrentPatternId()
    );
    if (currentPlaybackPatternIndex === -1) return;

    await this.play({
      startPatternIndex: currentPlaybackPatternIndex,
      endPatternIndex: currentPlaybackPatternIndex,
      startRow: options.startRow ?? 0,
      endRow: options.endRow ?? ROWS_PER_PATTERN - 1,
    });
  }

  /**
   * Play the entire song (all patterns in order)
   */
  public async playSong() {
    if (this.patternOrder.length === 0) return;

    await this.play({
      startPatternIndex: 0,
      endPatternIndex: this.patternOrder.length - 1,
      startRow: 0,
      endRow: ROWS_PER_PATTERN - 1,
    });
  }

  /**
   * Play a section of the current pattern
   */
  public async playSection(startRow: number, endRow: number) {
    const currentPlaybackPatternIndex = this.patternOrder.indexOf(
      this.getCurrentPatternId()
    );
    if (currentPlaybackPatternIndex === -1) return;

    await this.play({
      startPatternIndex: currentPlaybackPatternIndex,
      endPatternIndex: currentPlaybackPatternIndex,
      startRow,
      endRow,
    });
  }

  public getLooping() {
    return this.isLooping;
  }

  public setLooping(isLooping: boolean) {
    this.isLooping = isLooping;
    this.emitter.emit("changedLooping", { isLooping });
  }

  public ensureAudioContextRunning() {
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public getMasterVolume() {
    return this.masterGainNode.gain.value;
  }

  public setMasterVolume(volume: number) {
    const clampedVolume = Math.max(0, Math.min(volume, 1)); // 0 to 1 range
    this.masterGainNode.gain.setValueAtTime(
      clampedVolume,
      this.ctx.currentTime
    );
    this.emitter.emit("changedMasterVolume", { volume: clampedVolume });
  }
}

// Create a single instance of the tracker
export const tracker = new Tracker();
