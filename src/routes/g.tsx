import { ROWS_PER_PATTERN } from "@/audio/constants";
import { ChannelType } from "@/audio/types";
import { N } from "@/components/n";
import { P1 } from "@/components/p1";
import { P2 } from "@/components/p2";
import { W } from "@/components/w";
import { useActive } from "@/hooks/use-active";
import { useChannel } from "@/hooks/use-channel";
import { createFileRoute } from "@tanstack/react-router";
import { ConeIcon, EarIcon, EarOffIcon } from "lucide-react";
import { memo, useEffect } from "react";

export const Route = createFileRoute("/g")({
  component: G,
});

const rowHeaders = Array.from({ length: ROWS_PER_PATTERN }, (_, i) =>
  i < 10 ? `0${i}` : i.toString()
);

function G() {
  const { active, setActiveCell, setActiveRow, clearActive } = useActive();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearActive();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // This useEffect is to navigate the active cell with the arrow keys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (active.row !== null && active.col !== null) {
        let newRow = active.row;
        let newCol = active.col;

        switch (event.key) {
          case "ArrowUp":
            newRow = Math.max(0, active.row - 1);
            break;
          case "ArrowDown":
            newRow = Math.min(ROWS_PER_PATTERN - 1, active.row + 1);
            break;
          case "ArrowLeft":
            newCol = Math.max(0, active.col - 1);
            break;
          case "ArrowRight":
            newCol = Math.min(3, active.col + 1);
            break;
          default:
            return; // Exit this handler for other keys
        }

        event.preventDefault();
        setActiveCell(newRow, newCol);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active.row, active.col, setActiveCell]);

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
            return (
              <tr
                data-active={active.row === rowIndex && active.col === null}
                key={header}
                className={`group data-[active=true]:bg-blue-200`}
              >
                <RowNumber
                  text={header}
                  setRowAsActive={() => setActiveRow(rowIndex)}
                />

                {/* Pulse1 Cell */}

                <P1
                  row={rowIndex}
                  isActive={active.row === rowIndex && active.col === 0}
                  setAsActive={() => setActiveCell(rowIndex, 0)}
                />

                {/* Pulse2 Cell */}

                <P2
                  row={rowIndex}
                  isActive={active.row === rowIndex && active.col === 1}
                  setAsActive={() => setActiveCell(rowIndex, 1)}
                />

                {/* Wave Cell */}
                <W
                  row={rowIndex}
                  isActive={active.row === rowIndex && active.col === 2}
                  setAsActive={() => setActiveCell(rowIndex, 2)}
                />

                {/* Noise Cell */}
                <N
                  row={rowIndex}
                  isActive={active.row === rowIndex && active.col === 3}
                  setAsActive={() => setActiveCell(rowIndex, 3)}
                />
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
      <th className="border" onClick={setRowAsActive}>
        <button className="text-muted-foreground tabular-nums bg-secondary px-1 py-0.5 select-none">
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
