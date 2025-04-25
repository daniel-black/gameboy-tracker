import { ROWS_PER_PATTERN } from "@/audio/constants";
import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { ChannelType } from "@/audio/types";
import { useChannel } from "@/hooks/use-channel";
import { stateAtom } from "@/store";
import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { ConeIcon, EarIcon, EarOffIcon } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/g")({
  component: G,
});

const rowHeaders = Array.from({ length: ROWS_PER_PATTERN }, (_, i) =>
  i < 10 ? `0${i}` : i.toString()
);

type InputRef = HTMLInputElement | null;
type CellRef = HTMLTableCellElement | null;
type RowRef = HTMLTableRowElement | null;

function G() {
  const [cells, setCells] = useState(tracker.getPatternCells());
  // console.log(cells);

  const [{ active, inputIndex }, setState] = useAtom(stateAtom);

  // console.log({ row: active.row, col: active.col, i: inputIndex });

  const refs = useRef<{
    rows: Array<{
      ref: RowRef;
      cells: Array<{
        ref: CellRef;
        inputs: Array<InputRef>;
      }>;
    }>;
  }>({ rows: [] });

  // Sets up listener to update pattern when cells change
  useEffect(() => {
    const handleChangedCellEvent = (_: TrackerEventMap["changedCell"]) => {
      console.log("changedCell", _);
      setCells(tracker.getPatternCells());
    };

    tracker.emitter.on("changedCell", handleChangedCellEvent);

    return () => {
      tracker.emitter.off("changedCell", handleChangedCellEvent);
    };
  }, []);

  useEffect(() => {
    const handleKeyDownEvent = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setState((prev) => ({
          ...prev,
          active: { row: null, col: null },
          inputIndex: null,
        }));
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDownEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, [active.row]);

  useEffect(() => {
    if (active.row !== null && active.col !== null && inputIndex !== null) {
      refs.current.rows[active.row]?.cells[active.col].inputs[
        inputIndex
      ]?.focus();
    }
  }, [active.row, active.col, inputIndex]);

  function handleKeyDown(
    e: React.KeyboardEvent,
    row: number,
    cell: number,
    input: number
  ) {
    const maxInputs = refs.current.rows[row]?.cells[cell]?.inputs.length ?? 0;
    const next = { row, cell, input };

    if (e.key === "ArrowRight") {
      // room to move right within the cell
      if (input < maxInputs - 1) {
        next.input++;
      }
      // room to move right to the next cell
      else if (cell < 3) {
        next.cell++;
        next.input = 0;
      }
    } else if (e.key === "ArrowLeft") {
      if (input > 0) {
        next.input--;
      } else if (cell > 0) {
        const prevInputs =
          refs.current.rows[row]?.cells[cell - 1]?.inputs.length ?? 1;
        next.cell--;
        next.input = prevInputs - 1;
      }
    } else if (e.key === "ArrowDown") {
      if (row < refs.current.rows.length - 1) {
        next.row++;
      }
    } else if (e.key === "ArrowUp") {
      if (row > 0) {
        next.row--;
      }
    } else {
      return;
    }

    e.preventDefault();

    setState({
      active: { row: next.row, col: next.cell },
      inputIndex: next.input,
    });
  }

  const setRowRef = (index: number) => (el: HTMLTableRowElement | null) => {
    if (!refs.current.rows[index]) {
      refs.current.rows[index] = { ref: null, cells: [] };
    }
    refs.current.rows[index].ref = el;
  };

  const setCellRef =
    (rowIndex: number, cellIndex: number) =>
    (el: HTMLTableCellElement | null) => {
      if (!refs.current.rows[rowIndex]) {
        refs.current.rows[rowIndex] = { ref: null, cells: [] };
      }
      if (!refs.current.rows[rowIndex].cells[cellIndex]) {
        refs.current.rows[rowIndex].cells[cellIndex] = {
          ref: null,
          inputs: [],
        };
      }
      refs.current.rows[rowIndex].cells[cellIndex].ref = el;
    };

  const setInputRef =
    (rowIndex: number, cellIndex: number, inputIndex: number) =>
    (el: HTMLInputElement | null) => {
      if (!refs.current.rows[rowIndex]) {
        refs.current.rows[rowIndex] = { ref: null, cells: [] };
      }

      if (!refs.current.rows[rowIndex].cells[cellIndex]) {
        refs.current.rows[rowIndex].cells[cellIndex] = {
          ref: null,
          inputs: [],
        };
      }

      // Similar initialization logic
      refs.current.rows[rowIndex].cells[cellIndex].inputs[inputIndex] = el;
    };

  return (
    <div className="h-full">
      <table className="border border-collapse font-mono">
        <thead>
          <tr className="select-none bg-secondary">
            <th className="border"></th>
            <ChannelHeader channel="pulse1" />
            <ChannelHeader channel="pulse2" />
            <ChannelHeader channel="wave" />
            <ChannelHeader channel="noise" />
          </tr>
        </thead>
        <tbody className="text-xs">
          {rowHeaders.map((header, rowIndex) => {
            const isRowActive = active?.row === rowIndex;

            return (
              <tr
                ref={setRowRef(rowIndex)}
                key={header}
                data-active={isRowActive}
                className={`group data-[active=true]:bg-accent/70`}
              >
                <RowNumber
                  text={header}
                  setRowAsActive={() =>
                    setState({
                      active: { row: rowIndex, col: null },
                      inputIndex: null,
                    })
                  }
                />
                <td
                  className="border px-2 focus-within:bg-accent focus-within:inset-ring-1 focus-within:inset-ring-blue-400"
                  ref={setCellRef(rowIndex, 0)}
                  onClick={() =>
                    setState({
                      active: { row: rowIndex, col: 0 },
                      inputIndex: 0,
                    })
                  }
                >
                  <div className="flex justify-around items-center gap-1 ">
                    <input
                      ref={setInputRef(rowIndex, 0, 0)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.pulse1[rowIndex].note}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("pulse1", rowIndex, {
                          ...cells.pulse1[rowIndex],
                          note: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 0, 0)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 0 },
                          inputIndex: 0,
                        })
                      }
                    />
                    <input
                      ref={setInputRef(rowIndex, 0, 1)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.pulse1[rowIndex].volume}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("pulse1", rowIndex, {
                          ...cells.pulse1[rowIndex],
                          volume: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 0, 1)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 0 },
                          inputIndex: 1,
                        })
                      }
                    />
                    <input
                      ref={setInputRef(rowIndex, 0, 2)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.pulse1[rowIndex].dutyCycle}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("pulse1", rowIndex, {
                          ...cells.pulse1[rowIndex],
                          dutyCycle: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 0, 2)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 0 },
                          inputIndex: 2,
                        })
                      }
                    />
                    <input
                      ref={setInputRef(rowIndex, 0, 3)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.pulse1[rowIndex].envelope}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("pulse1", rowIndex, {
                          ...cells.pulse1[rowIndex],
                          envelope: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 0, 3)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 0 },
                          inputIndex: 3,
                        })
                      }
                    />
                    <input
                      ref={setInputRef(rowIndex, 0, 4)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.pulse1[rowIndex].sweep}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("pulse1", rowIndex, {
                          ...cells.pulse1[rowIndex],
                          sweep: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 0, 4)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 0 },
                          inputIndex: 4,
                        })
                      }
                    />
                  </div>
                </td>
                <td
                  className="border px-2 focus-within:bg-accent focus-within:inset-ring-1 focus-within:inset-ring-blue-400"
                  ref={setCellRef(rowIndex, 1)}
                  onClick={() =>
                    setState({
                      active: { row: rowIndex, col: 1 },
                      inputIndex: 0,
                    })
                  }
                >
                  <div className="flex justify-around items-center gap-1 ">
                    <input
                      ref={setInputRef(rowIndex, 1, 0)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.pulse2[rowIndex].note}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("pulse2", rowIndex, {
                          ...cells.pulse2[rowIndex],
                          note: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 1, 0)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 1 },
                          inputIndex: 0,
                        })
                      }
                    />
                    <input
                      ref={setInputRef(rowIndex, 1, 1)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.pulse2[rowIndex].volume}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("pulse2", rowIndex, {
                          ...cells.pulse2[rowIndex],
                          volume: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 1, 1)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 1 },
                          inputIndex: 1,
                        })
                      }
                    />
                    <input
                      ref={setInputRef(rowIndex, 1, 2)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.pulse2[rowIndex].dutyCycle}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("pulse2", rowIndex, {
                          ...cells.pulse2[rowIndex],
                          dutyCycle: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 1, 2)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 1 },
                          inputIndex: 2,
                        })
                      }
                    />
                    <input
                      ref={setInputRef(rowIndex, 1, 3)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.pulse2[rowIndex].envelope}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("pulse2", rowIndex, {
                          ...cells.pulse2[rowIndex],
                          envelope: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 1, 3)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 1 },
                          inputIndex: 3,
                        })
                      }
                    />
                  </div>
                </td>
                <td
                  className="border px-2 focus-within:bg-accent focus-within:inset-ring-1 focus-within:inset-ring-blue-400"
                  ref={setCellRef(rowIndex, 2)}
                  onClick={() =>
                    setState({
                      active: { row: rowIndex, col: 2 },
                      inputIndex: 0,
                    })
                  }
                >
                  <div className="flex justify-around items-center gap-1 ">
                    <input
                      ref={setInputRef(rowIndex, 2, 0)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.wave[rowIndex].note}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("wave", rowIndex, {
                          ...cells.wave[rowIndex],
                          note: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 2, 0)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 2 },
                          inputIndex: 0,
                        })
                      }
                    />
                    <input
                      ref={setInputRef(rowIndex, 2, 1)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.wave[rowIndex].volume}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("wave", rowIndex, {
                          ...cells.wave[rowIndex],
                          volume: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 2, 1)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 2 },
                          inputIndex: 1,
                        })
                      }
                    />
                    <input
                      ref={setInputRef(rowIndex, 2, 2)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.wave[rowIndex].waveForm}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("wave", rowIndex, {
                          ...cells.wave[rowIndex],
                          waveForm: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 2, 2)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 2 },
                          inputIndex: 2,
                        })
                      }
                    />
                  </div>
                </td>
                <td
                  className="border px-2 focus-within:bg-accent focus-within:inset-ring-1 focus-within:inset-ring-blue-400"
                  ref={setCellRef(rowIndex, 3)}
                  onClick={() =>
                    setState({
                      active: { row: rowIndex, col: 3 },
                      inputIndex: 0,
                    })
                  }
                >
                  <div className="flex justify-around items-center gap-1 ">
                    <input
                      ref={setInputRef(rowIndex, 3, 0)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.noise[rowIndex].rate}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("noise", rowIndex, {
                          ...cells.noise[rowIndex],
                          rate: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 3, 0)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 3 },
                          inputIndex: 0,
                        })
                      }
                    />
                    <input
                      ref={setInputRef(rowIndex, 3, 1)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.noise[rowIndex].volume}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("noise", rowIndex, {
                          ...cells.noise[rowIndex],
                          volume: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 3, 1)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 3 },
                          inputIndex: 1,
                        })
                      }
                    />
                    <input
                      ref={setInputRef(rowIndex, 3, 2)}
                      type="text"
                      className="w-6 border"
                      defaultValue={cells.noise[rowIndex].envelope}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        tracker.setCell("noise", rowIndex, {
                          ...cells.noise[rowIndex],
                          envelope: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, 3, 2)}
                      onFocus={() =>
                        setState({
                          active: { row: rowIndex, col: 3 },
                          inputIndex: 2,
                        })
                      }
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type RowNumberProps = {
  text: string;
  setRowAsActive: () => void;
};

const RowNumber = memo(
  function RowNumber({ text, setRowAsActive }: RowNumberProps) {
    return (
      <th className="border">
        <button
          className="text-muted-foreground tabular-nums bg-secondary px-1 py-0.5 select-none"
          onClick={setRowAsActive}
        >
          {text}
        </button>
      </th>
    );
  },
  (prevProps, nextProps) => prevProps.text === nextProps.text
);

const ChannelHeader = memo(function ChannelHeader({
  channel,
}: {
  channel: ChannelType;
}) {
  const { isChannelEnabled, toggleChannel, spotlightChannel } =
    useChannel(channel);

  return (
    <th
      scope="col"
      className="border focus-within:inset-ring-1 focus-within:inset-ring-blue-200 focus-within:z-50"
    >
      <div className="flex items-center">
        <button
          className="px-2 focus:outline-none flex items-center gap-1 group"
          onClick={toggleChannel}
        >
          {isChannelEnabled ? (
            <EarIcon className="size-3.5 group-focus:bg-blue-200 rounded-full" />
          ) : (
            <EarOffIcon className="size-3.5 group-focus:bg-blue-200 rounded-full" />
          )}
          <span>{channel}</span>
        </button>

        <button
          className="focus:outline-none px-2 group"
          onClick={(e) => {
            e.stopPropagation();
            spotlightChannel();
          }}
        >
          <ConeIcon className="size-3.5 group-focus:bg-blue-200 rounded-full" />
        </button>
      </div>
    </th>
  );
});
