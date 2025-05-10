import { memo } from "react";

type RowNumberProps = {
  text: string;
  setRowAsActive: () => void;
};

export const RowNumber = memo(
  function RowNumber({ text, setRowAsActive }: RowNumberProps) {
    return (
      <th className="border">
        <button
          className="text-muted-foreground tabular-nums bg-secondary px-1 py-0.5 select-none focus:outline-0 focus:inset-ring-1 focus:inset-ring-blue-400"
          onClick={setRowAsActive}
        >
          {text}
        </button>
      </th>
    );
  },
  (prevProps, nextProps) => prevProps.text === nextProps.text
);
