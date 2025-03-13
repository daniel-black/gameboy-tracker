import { Note } from "./notes";
import { ChannelType } from "./channels";
import { ROWS_PER_PATTERN } from "./constants";
import { VolumeLevel } from "./volume";
import { DutyCycle } from "./wave-shaper";

export class Pattern {
  public id: string;
  public name: string;

  private cellData: Record<ChannelType, Array<Cell | null>>;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;

    this.cellData = {
      pulse1: new Array(64).fill(null),
      pulse2: new Array(64).fill(null),
      wave: new Array(64).fill(null),
      noise: new Array(64).fill(null),
    };
  }

  public setName(name: string) {
    this.name = name;
  }

  public getCell(channel: ChannelType, row: number) {
    if (row < 0 || row >= ROWS_PER_PATTERN) {
      throw new Error("Row out of bounds");
    }

    return this.cellData[channel][row];
  }

  public setCell(channel: ChannelType, row: number, newCell: Cell | null) {
    if (row < 0 || row >= ROWS_PER_PATTERN) {
      throw new Error("Row out of bounds");
    }

    this.cellData[channel][row] = newCell;
  }
}

export interface Cell {
  note: Note;
  volume: VolumeLevel;
  dutyCycle?: DutyCycle; // for pulse1 and pulse2
}
