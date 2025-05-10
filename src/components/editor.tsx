import { ROWS_PER_PATTERN } from "@/audio/constants";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
  Selection,
} from "react-aria-components";
import { useState } from "react";
import { Pulse1Cell } from "./pulse1-cell";
import { Pulse2Cell } from "./pulse2-cell";
import { WaveCell } from "./wave-cell";
import { NoiseCell } from "./noise-cell";
import { useSetAtom } from "jotai";
import { sectionRangeAtom } from "@/store";
import { ChannelLabel } from "./channel-label";

const rowHeaders = Array.from({ length: ROWS_PER_PATTERN }, (_, i) =>
  i < 10 ? `0${i}` : i.toString()
);

export function Editor() {
  // State to track selected rows
  const [selectedRows, setSelectedRows] = useState<Selection>(new Set());
  const setRange = useSetAtom(sectionRangeAtom);

  // Handler for selection changes
  const onSelectionChange = (selection: Selection) => {
    const [i, j] = Object.values(selection);
    if (i === null || j === null) {
      console.log("no rows selected");
      setRange({ start: null, end: null });
      return;
    }

    const pi = parseInt(i, 10);
    const pj = parseInt(j, 10);

    const start = Math.min(pi, pj);
    const end = Math.max(pi, pj);

    setSelectedRows(selection);
    setRange({ start, end });
    // You could add logic here to play only selected rows if needed
  };

  return (
    <div className="h-full flex flex-col border shadow-sm ">
      <div className="overflow-y-auto flex-1 bg-transparent">
        <Table
          aria-label="Tracker Editor"
          className="w-full border-collapse font-mono bg-card text-card-foreground"
          selectionMode="multiple"
          selectionBehavior="replace"
          selectedKeys={selectedRows}
          onSelectionChange={onSelectionChange}
        >
          <TableHeader className="sticky top-0 z-10 bg-background">
            <Column className="border h-8"></Column>
            <Column className="border px-2">
              <ChannelLabel channelIndex={0} />
            </Column>
            <Column className="border px-2">
              <ChannelLabel channelIndex={1} />
            </Column>
            <Column className="border px-2">
              <ChannelLabel channelIndex={2} />
            </Column>
            <Column className="border px-2">
              <ChannelLabel channelIndex={3} />
            </Column>
          </TableHeader>
          <TableBody className="text-xs">
            {rowHeaders.map((rowHeader, rowIndex) => (
              <Row
                key={rowIndex}
                id={rowIndex.toString()}
                className="border aria-selected:bg-gray-100"
                // Fires when the entire row is selected and the user hits Enter
                // onAction={() => console.log("action!")}
              >
                <Cell className="border p-1">{rowHeader}</Cell>
                <Cell className="border p-1">
                  <Pulse1Cell row={rowIndex} />
                </Cell>
                <Cell className="border p-1">
                  <Pulse2Cell row={rowIndex} />
                </Cell>
                <Cell className="border p-1">
                  <WaveCell row={rowIndex} />
                </Cell>
                <Cell className="border p-1">
                  <NoiseCell row={rowIndex} />
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
