import { nanoid } from "nanoid";
import { ChannelType } from "./channels";
import { DEFAULT_BPM, MAX_PATTERNS, ROWS_PER_PATTERN } from "./constants";
import {
  createDefaultNoiseCell,
  createDefaultPulseCell,
  createDefaultWaveCell,
  NoiseCell,
  PulseCell,
  WaveCell,
} from "./cell";
import { TypedEventEmitter } from "./typed-event-emmiter";
import { getWaveShaperCurve } from "./wave-shaper";

export type PlaybackStatus = "stopped" | "paused" | "playing";
export type LoopStatus = "off" | "pattern" | "song";

/**
 * A tracker for a music sequencer that keeps track of the tempo and timing of the music.
 */
export class Tracker {
  // Audio Context and master volume
  private ctx: AudioContext;
  private masterGainNode: GainNode;

  // Pattern state
  private patterns: Map<string, Pattern>;
  private patternOrder: Array<string>;
  private currentPatternId: string;

  // Playback state
  private bpm: number;
  private currentRow: number;
  private playbackStatus: PlaybackStatus;
  private loopStatus: LoopStatus;

  private channels: Channels;

  // Emitter to let the UI know what's up
  public emitter: TypedEventEmitter<TrackerEventMap>;

  constructor() {
    this.ctx = new AudioContext();

    // Create a master gain node & connect it to the audio context destination
    this.masterGainNode = this.ctx.createGain();
    this.masterGainNode.connect(this.ctx.destination);

    // Create the channels
    this.channels = {
      pulse1: {
        source: new OscillatorNode(this.ctx, { type: "sawtooth" }),
        waveShaper: new WaveShaperNode(this.ctx, {
          curve: getWaveShaperCurve(0.5),
        }),
        gainNode: new GainNode(this.ctx),
        gate: new GainNode(this.ctx, { gain: 1 }),
      },
      pulse2: {
        source: new OscillatorNode(this.ctx, { type: "sawtooth" }),
        waveShaper: new WaveShaperNode(this.ctx, {
          curve: getWaveShaperCurve(0.5),
        }),
        gainNode: new GainNode(this.ctx),
        gate: new GainNode(this.ctx, { gain: 1 }),
      },
      wave: {
        source: null,
        gainNode: new GainNode(this.ctx),
        gate: new GainNode(this.ctx, { gain: 1 }),
      },
      noise: {
        source: null,
        gainNode: new GainNode(this.ctx),
        gate: new GainNode(this.ctx, { gain: 1 }),
      },
    };

    // Configure the channels and connect the audio nodes
    this.channels.pulse1
      .source!.connect(this.channels.pulse1.waveShaper)
      .connect(this.channels.pulse1.gainNode)
      .connect(this.channels.pulse1.gate)
      .connect(this.masterGainNode);

    this.channels.pulse2
      .source!.connect(this.channels.pulse2.waveShaper)
      .connect(this.channels.pulse2.gainNode)
      .connect(this.channels.pulse2.gate)
      .connect(this.masterGainNode);

    // No source hooked up to the wave channel yet
    this.channels.wave.gainNode
      .connect(this.channels.wave.gate)
      .connect(this.masterGainNode);

    // No source hooked up to the noise channel yet
    this.channels.noise.gainNode
      .connect(this.channels.noise.gate)
      .connect(this.masterGainNode);

    // Set up patterns
    this.patterns = new Map<string, Pattern>();
    const initialPattern = this.createNewPattern("Pattern 1");
    this.patterns.set(initialPattern.id, initialPattern);
    this.patternOrder = [initialPattern.id];
    this.currentPatternId = initialPattern.id;

    // Set up playback state
    this.bpm = DEFAULT_BPM;
    this.currentRow = 0;
    this.playbackStatus = "stopped";
    this.loopStatus = "off";

    // Set up event emitter
    this.emitter = new TypedEventEmitter<TrackerEventMap>();
  }

  private createNewPattern(name?: string): Pattern {
    return {
      name: name || `Pattern ${this.patterns.size + 1}`,
      id: nanoid(),
      cells: {
        pulse1: new Array(ROWS_PER_PATTERN).fill(createDefaultPulseCell()),
        pulse2: new Array(ROWS_PER_PATTERN).fill(createDefaultPulseCell()),
        wave: new Array(ROWS_PER_PATTERN).fill(createDefaultWaveCell()),
        noise: new Array(ROWS_PER_PATTERN).fill(createDefaultNoiseCell()),
      },
    };
  }

  public getBpm() {
    return this.bpm;
  }

  public setBpm(bpm: number) {
    this.bpm = bpm;
    this.emitter.emit("changedBpm", { bpm });
  }

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

  public getIsChannelEnabled(channel: ChannelType) {
    return this.channels[channel].gate.gain.value === 1;
  }

  public toggleChannel(channel: ChannelType) {
    const isEnabled = this.getIsChannelEnabled(channel);
    this.channels[channel].gate.gain.value = isEnabled ? 0 : 1;
    this.emitter.emit("toggledChannel", { channel, enabled: !isEnabled });
  }

  public getCurrentPattern() {
    const currentPattern = this.patterns.get(this.currentPatternId);
    if (!currentPattern) {
      throw new Error("no current pattern");
    }

    return currentPattern;
  }

  public getCurrentPatternId() {
    return this.currentPatternId;
  }

  public getPulse1Cell(row: number): PulseCell {
    return this.getCurrentPattern().cells.pulse1[row];
  }

  public setPulse1Cell(row: number, newCell: PulseCell) {
    this.getCurrentPattern().cells.pulse1[row] = newCell;
    this.emitter.emit("changedPulse1Cell", { row });
  }

  public getPulse2Cell(row: number): PulseCell {
    return this.getCurrentPattern().cells.pulse2[row];
  }

  public setPulse2Cell(row: number, newCell: PulseCell) {
    this.getCurrentPattern().cells.pulse2[row] = newCell;
    this.emitter.emit("changedPulse2Cell", { row });
  }

  public setWaveCell(row: number, newCell: WaveCell) {
    this.getCurrentPattern().cells.wave[row] = newCell;
    this.emitter.emit("changedWaveCell", { row });
  }

  public getWaveCell(row: number): WaveCell {
    return this.getCurrentPattern().cells.wave[row];
  }

  public getNoiseCell(row: number): NoiseCell {
    return this.getCurrentPattern().cells.noise[row];
  }

  public setNoiseCell(row: number, newCell: NoiseCell) {
    this.getCurrentPattern().cells.noise[row] = newCell;
    this.emitter.emit("changedNoiseCell", { row });
  }
}

// Create a single instance of the tracker
export const tracker = new Tracker();

export interface TrackerEventMap {
  changedBpm: { bpm: number };
  changedCurrentPattern: { patternId: string };
  toggledChannel: { channel: ChannelType; enabled: boolean };
  changedPulse1Cell: { row: number };
  changedPulse2Cell: { row: number };
  changedWaveCell: { row: number };
  changedNoiseCell: { row: number };
}

interface Channels {
  pulse1: {
    source: OscillatorNode | null;
    waveShaper: WaveShaperNode;
    gainNode: GainNode;
    gate: GainNode;
  };
  pulse2: {
    source: OscillatorNode | null;
    gainNode: GainNode;
    waveShaper: WaveShaperNode;
    gate: GainNode;
  };
  wave: {
    source: OscillatorNode | null;
    gainNode: GainNode;
    gate: GainNode;
  };
  noise: {
    source: AudioBufferSourceNode | null;
    gainNode: GainNode;
    gate: GainNode;
  };
}

export interface Pattern {
  id: string;
  name: string;
  cells: {
    pulse1: Array<PulseCell>;
    pulse2: Array<PulseCell>;
    wave: Array<WaveCell>;
    noise: Array<NoiseCell>;
  };
}
