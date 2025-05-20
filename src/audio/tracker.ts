import { nanoid } from "nanoid";
import {
  CHANNEL_INDICES,
  DEFAULT_BPM,
  ENVELOPE_TICKS_PER_ROW,
  MAX_FREQUENCY,
  MAX_PATTERNS,
  MIN_FREQUENCY,
  ROWS_PER_BEAT,
  ROWS_PER_PATTERN,
  SWEEP_TICKS_PER_ROW,
} from "./constants";
import { createDefaultRow, UnifiedCell } from "./cell";
import { TypedEventEmitter } from "./typed-event-emmiter";
import { getWaveShaperCurve } from "./wave-shaper";
import { TrackerEventMap } from "./events";
import { ChannelIndex, Channels, Pattern, PatternMetadata, Row } from "./types";
import { getFrequency } from "./notes";
import { getVolume, getWaveVolume, WAVE_VOLUME_KEYS } from "./volume";
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

  // Audio channels: [pulse1, pulse2, wave, noise]
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
    this.channels = [
      {
        source: new OscillatorNode(this.ctx, { type: "sawtooth" }),
        waveShaper: new WaveShaperNode(this.ctx, {
          curve: getWaveShaperCurve(0.5),
        }),
        gainNode: new GainNode(this.ctx, { gain: 0 }),
        gate: new GainNode(this.ctx, { gain: 1 }),
      },
      {
        source: new OscillatorNode(this.ctx, { type: "sawtooth" }),
        waveShaper: new WaveShaperNode(this.ctx, {
          curve: getWaveShaperCurve(0.5),
        }),
        gainNode: new GainNode(this.ctx, { gain: 0 }),
        gate: new GainNode(this.ctx, { gain: 1 }),
      },
      {
        source: new OscillatorNode(this.ctx, { type: "sine" }),
        gainNode: new GainNode(this.ctx, { gain: 0 }),
        gate: new GainNode(this.ctx, { gain: 1 }),
      },
      {
        source: new AudioBufferSourceNode(this.ctx, { buffer, loop: true }),
        gainNode: new GainNode(this.ctx, { gain: 0 }),
        gate: new GainNode(this.ctx, { gain: 1 }),
      },
    ];

    // Connect the nodes in each channel
    this.channels.forEach((channel) => {
      if ("waveShaper" in channel) {
        channel.source.connect(channel.waveShaper);
        channel.waveShaper.connect(channel.gainNode);
      } else {
        channel.source.connect(channel.gainNode);
      }

      channel.gainNode.connect(channel.gate);
      channel.gate.connect(this.masterGainNode);
    });

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
  public getBpm(): number {
    return this.bpm;
  }

  /**
   * Sets the beats per minute of the tracker and emits a `changedBpm` event
   * @param bpm The new BPM to set
   */
  public setBpm(bpm: number): void {
    this.bpm = bpm;
    this.emitter.emit("changedBpm", { bpm });
  }

  private createNewPattern(name?: string): Pattern {
    return {
      name: name || `Pattern ${this.patterns.size + 1}`,
      id: nanoid(4),
      data: Array.from({ length: ROWS_PER_PATTERN }, createDefaultRow),
    };
  }

  /**
   * Sets the current pattern to a specific pattern by id and emits a `changedCurrentPattern` event
   * @param id The id of the pattern to set as the current pattern
   */
  public setCurrentPatternId(id: string): void {
    this.currentPatternId = id;
    this.emitter.emit("changedCurrentPattern", { patternId: id });
  }

  public deletePattern(id: string): void {
    if (this.patterns.has(id) && this.patterns.size > 1) {
      // Delete the pattern from the map
      this.patterns.delete(id);

      // Remove the pattern from the order array
      this.patternOrder = this.patternOrder.filter(
        (patternId) => patternId !== id
      );

      // If the deleted pattern was the current pattern, set the first pattern as the current one
      if (this.getCurrentPatternId() === id) {
        const newCurrentPatternId = this.patternOrder[0];
        this.setCurrentPatternId(newCurrentPatternId);
      }

      this.emitter.emit("deletedPattern", { patternId: id });
    }
  }

  public addPattern(): void {
    if (this.patterns.size >= MAX_PATTERNS) {
      return;
    }

    const newPattern = this.createNewPattern();

    this.patterns.set(newPattern.id, newPattern);
    this.patternOrder.push(newPattern.id);

    this.emitter.emit("addedPattern", { patternId: newPattern.id });
  }

  /**
   * Gets whether a channel is enabled or not
   * @param channel Either "pulse1", "pulse2", "wave", or "noise"
   * @returns A boolean indicating whether the channel is enabled
   */
  public getIsChannelEnabled(channelIndex: ChannelIndex): boolean {
    return this.channels[channelIndex].gate.gain.value === 1;
  }

  /**
   * Toggles a channel on or off and emits a `toggledChannel` event
   * @param channel Either "pulse1", "pulse2", "wave", or "noise"
   */
  public toggleChannel(channelIndex: ChannelIndex): void {
    const isEnabled = this.getIsChannelEnabled(channelIndex);
    this.channels[channelIndex].gate.gain.setValueAtTime(
      isEnabled ? 0 : 1,
      this.ctx.currentTime
    );
    this.emitter.emit("toggledChannel", {
      channelIndex,
      enabled: !isEnabled,
    });
  }

  /**
   * Silences all channels except the specified channel.
   * @param channel The channel to spotlight
   */
  public spotlightChannel(channelIndex: ChannelIndex): void {
    CHANNEL_INDICES.forEach((i) => {
      // Silence all channels except the specified one
      if (i !== channelIndex) {
        this.channels[i].gate.gain.setValueAtTime(0, this.ctx.currentTime);
        this.emitter.emit("toggledChannel", {
          channelIndex: i,
          enabled: false,
        });
      }
      // Enable the specified channel
      else {
        this.channels[i].gate.gain.setValueAtTime(1, this.ctx.currentTime);
        this.emitter.emit("toggledChannel", { channelIndex: i, enabled: true });
      }
    });
  }

  public getCurrentPattern(): Pattern {
    const currentPattern = this.patterns.get(this.getCurrentPatternId());
    if (!currentPattern) {
      throw new Error("no current pattern");
    }

    return currentPattern;
  }

  public getPatternData(): Array<Row> {
    return this.getCurrentPattern().data;
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

  public getAllPatternsMetadata(): Array<PatternMetadata> {
    return this.patternOrder.map((patternId) =>
      this.getPatternMetadata(patternId)
    );
  }

  public getCurrentPatternId(): string {
    return this.currentPatternId;
  }

  public getCellData(row: number, col: ChannelIndex): UnifiedCell {
    return this.getCurrentPattern().data[row][col];
  }

  public setCellData(row: number, col: ChannelIndex, newCell: UnifiedCell) {
    this.getCurrentPattern().data[row][col] = newCell;
    this.emitter.emit("changedCell", { row, col });
  }

  private startAllSources() {
    this.channels.forEach(({ source }) => source.start());
    this.sourcesStarted = true; // Prevent starting the sources multiple times
  }

  public async play(
    options: {
      startPatternIndex?: number;
      endPatternIndex?: number;
      startRow?: number;
      endRow?: number;
    } = {}
  ): Promise<void> {
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
  private scheduler(): void {
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
  private scheduleRow(time: number): void {
    const currentPlaybackPattern = this.getPatternById(
      this.patternOrder[this.currentPlaybackPatternIndex]
    );
    if (!currentPlaybackPattern) return;

    // Schedule each channel
    CHANNEL_INDICES.forEach((channelIndex) =>
      this.scheduleChannel(
        channelIndex,
        time,
        currentPlaybackPattern.data[this.currentPlaybackRow][channelIndex]
      )
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
  ): void {
    if (isContinue(envelopeString) || envelopeString.length !== 2) return;

    const [directionChar, stepChar] = envelopeString;

    if (
      !["0", "1"].includes(directionChar) ||
      !["1", "2", "3", "4", "5", "6", "7"].includes(stepChar)
    ) {
      return;
    }

    const isIncreasing = directionChar === "1";

    // Step speed determines how many ticks must pass before changing volume
    // Higher step speed (like 5) means slower volume change
    // Ex. 5 ticks need to pass before changing volume
    const stepSpeed = parseInt(stepChar, 10);

    const tickDuration = this.calculateSecondsPerRow() / ENVELOPE_TICKS_PER_ROW;
    let tickCounter = 0;

    // wave envelope still a little broken i think
    if (isWaveChannel) {
      // c is index of ["OF", "LO", "MD", "HI"]
      let indexOfVolumeCode = WAVE_VOLUME_KEYS.indexOf(initialVolumeString);
      if (indexOfVolumeCode === -1) {
        console.error("Invalid initial volume string:", initialVolumeString);
        return;
      }

      for (let i = 0; i < ENVELOPE_TICKS_PER_ROW; i++) {
        tickCounter++;

        if (tickCounter >= stepSpeed) {
          tickCounter = 0; // reset tick counter

          // Calculate next volume level based on direction
          if (isIncreasing) {
            indexOfVolumeCode = Math.min(3, indexOfVolumeCode + 1);
          } else {
            indexOfVolumeCode = Math.max(0, indexOfVolumeCode - 1);
          }

          const volume = getWaveVolume(WAVE_VOLUME_KEYS[indexOfVolumeCode]);
          const tickTime = time + (i + 1) * tickDuration;

          // Apply the volume change
          gainNode.gain.setValueAtTime(volume, tickTime);

          // Stop if we've reached the volume limit
          if (indexOfVolumeCode === 0 || indexOfVolumeCode === 3) {
            break;
          }
        }
      }

      return;
    }

    let currentVolume = parseInt(initialVolumeString, 10);

    for (let i = 0; i < ENVELOPE_TICKS_PER_ROW; i++) {
      // only update volume when enough ticks have passed based on stepSpeed
      tickCounter++;

      if (tickCounter >= stepSpeed) {
        tickCounter = 0; // reset tick counter

        // Calculate next volume level based on direction
        if (isIncreasing) {
          currentVolume = Math.min(15, currentVolume + 1);
        } else {
          currentVolume = Math.max(0, currentVolume - 1);
        }

        // Apply the volume change
        const volumeValue = getVolume(currentVolume.toString());
        const tickTime = time + (i + 1) * tickDuration;

        gainNode.gain.setValueAtTime(volumeValue, tickTime);

        // Stop if we've reached the volume limit
        if (currentVolume === 0 || currentVolume === 15) {
          break;
        }
      }
    }
  }

  private scheduleFrequencySweep(
    source: OscillatorNode,
    initialFrequency: number,
    sweepString: string,
    time: number
  ): void {
    if (isContinue(sweepString) || sweepString.length !== 3) return;

    const [directionChar, speedChar, shiftChar] = sweepString;

    if (
      !["0", "1"].includes(directionChar) ||
      !["1", "2", "3", "4", "5", "6", "7"].includes(speedChar) ||
      !["1", "2", "3", "4", "5", "6", "7"].includes(shiftChar)
    ) {
      return;
    }

    const isIncreasing = directionChar === "1";
    const stepSpeed = parseInt(speedChar, 10);
    const shift = parseInt(shiftChar, 10);

    const tickDuration = this.calculateSecondsPerRow() / SWEEP_TICKS_PER_ROW;

    let tickCounter = 0;
    let currentFrequency = initialFrequency;

    for (let i = 0; i < SWEEP_TICKS_PER_ROW; i++) {
      tickCounter++;

      if (tickCounter >= stepSpeed) {
        if (isIncreasing) {
          currentFrequency = Math.min(
            MAX_FREQUENCY,
            currentFrequency + (currentFrequency >> shift)
          );
        } else {
          currentFrequency = Math.max(
            MIN_FREQUENCY,
            currentFrequency - (currentFrequency >> shift)
          );
        }

        const tickTime = time + (i + 1) * tickDuration;

        source.frequency.setValueAtTime(currentFrequency, tickTime);

        // Stop if we've reached the frequency limit
        if (currentFrequency === 40 || currentFrequency === 20_000) {
          break;
        }
      }
    }
  }

  private scheduleChannel(
    channelIndex: ChannelIndex,
    time: number,
    cell: UnifiedCell
  ): void {
    // Skip scheduling if the channel is disabled
    if (!this.getIsChannelEnabled(channelIndex)) return;

    const c = this.channels[channelIndex];

    const isPulse1 = channelIndex === 0;
    const isPulse2 = channelIndex === 1;
    const isWave = channelIndex === 2;
    const isNoise = channelIndex === 3;

    // Handle note scheduling for all channels except noise
    if (
      !isNoise && // not noise
      c.source instanceof OscillatorNode &&
      "note" in cell &&
      !isContinue(cell.note!)
    ) {
      const initialFrequency = getFrequency(cell.note!);

      c.source.frequency.setValueAtTime(initialFrequency, time);

      if (isPulse1 && "sweep" in cell && !isContinue(cell.sweep!)) {
        this.scheduleFrequencySweep(
          this.channels[0].source,
          initialFrequency,
          cell.sweep!,
          time
        );
      }
    }

    // Handle playback rate (noise channel only)
    if (isNoise && "rate" in cell && !isContinue(cell.rate!)) {
      this.channels[3].source.playbackRate.setValueAtTime(
        getRate(cell.rate!),
        time
      );
    }

    // Handle volume (all channels)
    if ("volume" in cell && !isContinue(cell.volume)) {
      c.gainNode.gain.cancelScheduledValues(time);

      const initialVolume = isWave
        ? getWaveVolume(cell.volume)
        : getVolume(cell.volume);
      c.gainNode.gain.setValueAtTime(initialVolume, time);

      // Handle envelope (all channels except pulse2)
      if (!isPulse2 && "envelope" in cell && !isContinue(cell.envelope!)) {
        this.scheduleVolumeEnvelope(
          c.gainNode,
          cell.volume,
          cell.envelope!,
          time,
          isWave
        );
      }
    }

    // Handle duty cycle (pulse channels only)
    if (
      (channelIndex === 0 || channelIndex === 1) &&
      "waveShaper" in this.channels[channelIndex] &&
      "dutyCycle" in cell &&
      !isContinue(cell.dutyCycle!)
    ) {
      this.channels[channelIndex].waveShaper.curve = getWaveShaperCurve(
        getDutyCycle(cell.dutyCycle!)
      );
    }

    // Handle wave form (wave channel only)
    if (isWave && "waveForm" in cell && !isContinue(cell.waveForm!)) {
      this.channels[2].source.type = getWaveForm(cell.waveForm!);
    }
  }

  /**
   * Advance the playhead to the next row, handling pattern changes and looping
   */
  private advancePlayhead(): void {
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
  public async pause(): Promise<void> {
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
  public async resume(): Promise<void> {
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
  public async stop(): Promise<void> {
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
  private stopScheduler(): void {
    if (this.scheduleIntervalId !== null) {
      clearInterval(this.scheduleIntervalId);
      this.scheduleIntervalId = null;
    }
    this.isPlaying = false;
  }

  private silenceAllChannels(): void {
    this.channels.forEach(({ gainNode, source }) => {
      gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      gainNode.gain.setValueAtTime(0, this.ctx.currentTime);

      if (source instanceof OscillatorNode) {
        source.frequency.cancelScheduledValues(this.ctx.currentTime);
        source.frequency.setValueAtTime(0, this.ctx.currentTime);
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
  ): Promise<void> {
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
  public async playSong(): Promise<void> {
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
  public async playSection(startRow: number, endRow: number): Promise<void> {
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

  public getLooping(): boolean {
    return this.isLooping;
  }

  public setLooping(isLooping: boolean): void {
    this.isLooping = isLooping;
    this.emitter.emit("changedLooping", { isLooping });
  }

  public ensureAudioContextRunning() {
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public getMasterVolume(): number {
    return this.masterGainNode.gain.value;
  }

  public setMasterVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(volume, 1)); // 0 to 1 range
    this.masterGainNode.gain.setValueAtTime(
      clampedVolume,
      this.ctx.currentTime
    );
    this.emitter.emit("changedMasterVolume", { volume: clampedVolume });
  }
}

// Create a single instance of the tracker and export it for use in the app
export const tracker = new Tracker();
