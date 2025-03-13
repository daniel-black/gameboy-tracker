import { nanoid } from "nanoid";
import { ChannelType } from "./channels";
import { DEFAULT_BPM, MAX_PATTERNS } from "./constants";
import { Pattern } from "./patterns";
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
    const initialPatternId = nanoid();
    const initialPattern = new Pattern(initialPatternId, "Pattern 1");
    this.patterns.set(initialPatternId, initialPattern);
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

  public createPattern() {
    if (this.patterns.size >= MAX_PATTERNS) {
      return;
    }

    const id = nanoid();
    const pattern = new Pattern(id, `Pattern ${this.patterns.size + 1}`);

    this.patterns.set(id, pattern);
    this.patternOrder.push(id);
  }

  public getIsChannelEnabled(channel: ChannelType) {
    return this.channels[channel].gate.gain.value === 1;
  }

  public toggleChannel(channel: ChannelType) {
    const isEnabled = this.getIsChannelEnabled(channel);
    this.channels[channel].gate.gain.value = isEnabled ? 0 : 1;
    this.emitter.emit("toggledChannel", { channel, enabled: !isEnabled });
  }
}

// Create a single instance of the tracker
export const tracker = new Tracker();

export interface TrackerEventMap {
  changedBpm: { bpm: number };
  changedCurrentPattern: { patternId: string };
  toggledChannel: { channel: ChannelType; enabled: boolean };
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
