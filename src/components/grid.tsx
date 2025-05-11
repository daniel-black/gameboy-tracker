import { CHANNEL_INDICES, ROWS_PER_PATTERN } from "@/audio/constants";
import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { channelConfig } from "@/lib/config";
import { activeStateAtom, selectedStateAtom } from "@/store";
import { useAtom } from "jotai";
import { createRef, useEffect, useMemo, useState } from "react";
import { ChannelHeader } from "./channel-header";
import { cn } from "@/lib/utils";
import { RowNumber } from "./row-number";
import { Cell } from "./cell";
import { NoteInput } from "./note-input";
import { WaveVolumeInput } from "./wave-volume-input";
import { VolumeInput } from "./volume-input";
import { DutyCycleInput } from "./duty-cycle-input";
import { EnvelopeInput } from "./envelope-input";
import { SweepInput } from "./sweep-input";
import { WaveFormInput } from "./wave-form-input";
import { NoiseRateInput } from "./noise-rate-input";
import { usePlayback } from "@/hooks/use-playback";

const rowHeaders = Array.from({ length: ROWS_PER_PATTERN }, (_, i) =>
  i < 10 ? `0${i}` : i.toString()
);

const arrowKeys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"];

type TrackerRefs = {
  rowRefs: React.RefObject<HTMLTableRowElement | null>[];
  cellRefs: React.RefObject<HTMLTableCellElement | null>[][]; // [row][channel]
  inputRefs: React.RefObject<HTMLInputElement | null>[][][]; // [row][channel][inputIndex]
};

export function Grid() {
  const [data, setData] = useState(tracker.getPatternData());

  const [{ active, inputIndex }, setActive] = useAtom(activeStateAtom);
  const [selected, setSelected] = useAtom(selectedStateAtom);
  // console.log({
  //   ...selected,
  //   activeRow: active.row,
  //   activeCol: active.col,
  //   inputIndex,
  // });

  const { currentPlaybackRow } = usePlayback();
  // console.log(currentPlaybackRow);

  // Set up all the refs for the rows, cells, and inputs
  const { rowRefs, cellRefs, inputRefs } = useMemo<TrackerRefs>(() => {
    const rowRefs = Array.from({ length: ROWS_PER_PATTERN }, () =>
      createRef<HTMLTableRowElement>()
    );

    const cellRefs = Array.from({ length: ROWS_PER_PATTERN }, () =>
      CHANNEL_INDICES.map(() => createRef<HTMLTableCellElement>())
    );

    const inputRefs = Array.from({ length: ROWS_PER_PATTERN }, () =>
      CHANNEL_INDICES.map((channelIndex) =>
        channelConfig[channelIndex].inputs.map(() =>
          createRef<HTMLInputElement>()
        )
      )
    );

    return { rowRefs, cellRefs, inputRefs };
  }, []);

  // Sets up listener to update pattern when cells change
  useEffect(() => {
    const handleChangedCellEvent = (_: TrackerEventMap["changedCell"]) => {
      setData([...tracker.getPatternData()]); // get the latest pattern data
    };

    tracker.emitter.on("changedCell", handleChangedCellEvent);

    return () => {
      tracker.emitter.off("changedCell", handleChangedCellEvent);
    };
  }, []);

  // handles keyboard navigation
  useEffect(() => {
    const handleKeyDownEvent = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === "Escape") {
        // clear the active cell
        setActive((prev) => ({
          ...prev,
          active: { row: null, col: null },
          inputIndex: null,
        }));

        // clear any selected cells
        setSelected({ start: null, end: null });

        // blur the previously focused input if there is one
        if (active.row !== null && active.col !== null && inputIndex !== null) {
          inputRefs[active.row][active.col][inputIndex]?.current?.blur();
        }
        return;
      }

      // Row selection
      if (e.shiftKey && active.row !== null) {
        if (e.key === "ArrowUp" && active.row && active.row > 0) {
          const oneRowUp = active.row - 1;

          setSelected((prev) => {
            if (prev.start === null && prev.end === null) {
              return { start: oneRowUp, end: active.row };
            } else if (prev.end !== null) {
              return { start: oneRowUp, end: prev.end };
            }
            return prev;
          });

          if (active.col !== null && inputIndex !== null) {
            inputRefs[oneRowUp][active.col][inputIndex]?.current?.blur();
          }
          setActive({ active: { row: oneRowUp, col: null }, inputIndex: null });
        } else if (e.key === "ArrowDown" && active.row < ROWS_PER_PATTERN - 1) {
          const oneRowDown = active.row + 1;

          setSelected((prev) => {
            if (prev.start === null && prev.end === null) {
              return { start: active.row, end: oneRowDown };
            } else if (prev.start !== null) {
              return { start: prev.start, end: oneRowDown };
            }
            return prev;
          });

          setActive({
            active: { row: oneRowDown, col: null },
            inputIndex: null,
          });

          if (active.col !== null && inputIndex !== null) {
            inputRefs[oneRowDown][active.col][inputIndex]?.current?.blur();
          }
        }
        return;
      }

      // Handle Arrow keys
      if (arrowKeys.includes(e.key)) {
        // active cell&input is not set, just default to the first cell first input
        if (active.row === null && active.col === null && inputIndex === null) {
          setActive({
            active: { row: 0, col: 0 },
            inputIndex: 0,
          });
          inputRefs[0][0][0]?.current?.focus();
          return;
        }

        // moving rows
        if (active.row !== null && active.col === null && inputIndex === null) {
          if (e.key === "ArrowDown") {
            setActive((prev) => ({
              ...prev,
              active: {
                row: Math.min(prev.active.row! + 1, ROWS_PER_PATTERN - 1),
                col: null,
              },
            }));
          } else if (e.key === "ArrowUp") {
            setActive((prev) => ({
              ...prev,
              active: { row: Math.max(prev.active.row! - 1, 0), col: null },
            }));
          }
          e.preventDefault();
          return;
        }

        if (active.row === null || active.col === null || inputIndex === null) {
          console.warn("figure out this edge case, stupid");
          return;
        }

        // we have an active cell and input at this point
        const maxInputs = channelConfig[active.col].inputs.length ?? 0;
        const next: any = {
          row: active.row,
          col: active.col,
          input: inputIndex,
        };

        if (e.key === "ArrowRight") {
          // room to move right within the cell
          if (inputIndex < maxInputs - 1) {
            next.input++;
          }
          // room to move right to the next cell
          else if (active.col < 3) {
            next.col++;
            next.input = 0;
          }
        } else if (e.key === "ArrowLeft") {
          if (inputIndex > 0) {
            next.input--;
          } else if (active.col > 0) {
            const prevInputs = channelConfig[active.col - 1].inputs.length ?? 1;
            next.col--;
            next.input = prevInputs - 1;
          }
        } else if (e.key === "ArrowDown") {
          if (active.row < ROWS_PER_PATTERN - 1) {
            next.row++;
          }
        } else if (e.key === "ArrowUp") {
          if (active.row > 0) {
            next.row--;
          }
        }

        e.preventDefault();

        setActive({
          active: { row: next.row, col: next.col },
          inputIndex: next.input,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDownEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, [
    active.row,
    active.col,
    inputIndex,
    setActive,
    selected.start,
    selected.end,
    setSelected,
  ]);

  // handles focus on the active cell
  useEffect(() => {
    if (active.row !== null && active.col !== null && inputIndex !== null) {
      inputRefs[active.row][active.col][inputIndex]?.current?.focus();
    }
  }, [active.row, active.col, inputIndex]);

  return (
    <div className="h-screen overflow-hidden">
      <div className="h-full overflow-y-auto">
        <table className="border border-collapse w-full">
          <thead className="sticky top-0 z-10 bg-secondary">
            <tr className="select-none bg-secondary">
              <th className="border"></th>
              {CHANNEL_INDICES.map((index) => (
                <ChannelHeader key={index} index={index} />
              ))}
            </tr>
          </thead>
          <tbody className="text-xs">
            {rowHeaders.map((header, rowIndex) => {
              const isRowActive = active?.row === rowIndex;
              const isRowSelected =
                selected.start !== null &&
                selected.end !== null &&
                rowIndex >= selected.start &&
                rowIndex <= selected.end;
              const isRowPlaying = currentPlaybackRow === rowIndex;

              // RENDER A ROW
              return (
                <tr
                  ref={rowRefs[rowIndex]}
                  key={header}
                  data-active={isRowActive}
                  data-selected={isRowSelected}
                  className={cn(
                    "group transition-colors duration-75",
                    isRowSelected && !isRowActive && "bg-blue-100/80",
                    isRowActive && "bg-blue-100",
                    isRowPlaying && "bg-orange-100"
                  )}
                >
                  <RowNumber
                    text={header}
                    setRowAsActive={() =>
                      setActive({
                        active: { row: rowIndex, col: null },
                        inputIndex: null,
                      })
                    }
                  />

                  {CHANNEL_INDICES.map((colIndex) => {
                    const cellData = data[rowIndex][colIndex];
                    const cellInputs = channelConfig[colIndex].inputs;

                    // RENDER A CELL (4 per row)
                    return (
                      <Cell
                        key={`${rowIndex}-${colIndex}`}
                        ref={cellRefs[rowIndex][colIndex]}
                        isActive={isRowActive && active.col === colIndex}
                        onClick={() => {
                          setActive({
                            active: { row: rowIndex, col: colIndex },
                            inputIndex: 0,
                          });
                          setSelected({ start: null, end: null });
                        }}
                      >
                        {cellInputs.map(({ name }, inputIndex) => {
                          // RENDER AN INPUT (5, 4, 3, and 3 per cell)
                          const ref = inputRefs[rowIndex][colIndex][inputIndex];

                          const setValue = (newValue: string) => {
                            tracker.setCellData(rowIndex, colIndex, {
                              ...cellData,
                              [name]: newValue,
                            });
                          };

                          const setFocus = () => {
                            setActive({
                              active: { row: rowIndex, col: colIndex },
                              inputIndex,
                            });
                            setSelected({ start: null, end: null });
                          };

                          if (name === "note") {
                            return (
                              <NoteInput
                                key={`${rowIndex}-${colIndex}-${inputIndex}}`}
                                ref={ref}
                                note={cellData[name]!}
                                setNote={setValue}
                                setFocus={setFocus}
                              />
                            );
                          }

                          if (name === "volume") {
                            if (colIndex === 2) {
                              return (
                                <WaveVolumeInput
                                  key={`${rowIndex}-${colIndex}-${inputIndex}}`}
                                  ref={ref}
                                  volume={cellData[name]!}
                                  setVolume={setValue}
                                  setFocus={setFocus}
                                />
                              );
                            }
                            return (
                              <VolumeInput
                                key={`${rowIndex}-${colIndex}-${inputIndex}}`}
                                ref={ref}
                                volume={cellData[name]!}
                                setVolume={setValue}
                                setFocus={setFocus}
                              />
                            );
                          }

                          if (name === "dutyCycle") {
                            return (
                              <DutyCycleInput
                                key={`${rowIndex}-${colIndex}-${inputIndex}}`}
                                ref={ref}
                                dutyCycle={cellData[name]!}
                                setDutyCycle={setValue}
                                setFocus={setFocus}
                              />
                            );
                          }

                          if (name === "envelope") {
                            return (
                              <EnvelopeInput
                                key={`${rowIndex}-${colIndex}-${inputIndex}}`}
                                ref={ref}
                                envelope={cellData[name]!}
                                setEnvelope={setValue}
                                setFocus={setFocus}
                              />
                            );
                          }

                          if (name === "sweep") {
                            return (
                              <SweepInput
                                key={`${rowIndex}-${colIndex}-${inputIndex}}`}
                                ref={ref}
                                sweep={cellData[name]!}
                                setSweep={setValue}
                                setFocus={setFocus}
                              />
                            );
                          }

                          if (name === "waveForm") {
                            return (
                              <WaveFormInput
                                key={`${rowIndex}-${colIndex}-${inputIndex}}`}
                                ref={ref}
                                waveForm={cellData[name]!}
                                setWaveForm={setValue}
                                setFocus={setFocus}
                              />
                            );
                          }

                          if (name === "rate") {
                            return (
                              <NoiseRateInput
                                key={`${rowIndex}-${colIndex}-${inputIndex}}`}
                                ref={ref}
                                rate={cellData[name]!}
                                setRate={setValue}
                                setFocus={setFocus}
                              />
                            );
                          }

                          return null;

                          // return (
                          //   <CellInput
                          //     type={name}
                          //     isWave={colIndex === 2}
                          //     key={`${rowIndex}-${colIndex}-${inputIndex}-${cellData[name]}`}
                          //     ref={inputRefs[rowIndex][colIndex][inputIndex]}
                          //     value={cellData[name]!}
                          //     setValue={setValue}
                          //     setFocus={setFocus}
                          //   />
                          // );
                        })}
                      </Cell>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
