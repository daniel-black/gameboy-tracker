import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addPattern, setCurrentPatternIndex } from "../store/slices/song-slice";

export function Patterns() {
  const dispatch = useAppDispatch();
  const patternIndices = useAppSelector((s) =>
    s.song.patterns.map((_, i) => i)
  );

  function handleAddNewPattern() {
    dispatch(addPattern());
  }

  function handleChangeCurrentPatternIndex(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    dispatch(
      setCurrentPatternIndex(parseInt(e.currentTarget.value ?? "0", 10))
    );
  }

  return (
    <div className="flex gap-2">
      <p>Patterns</p>

      <ul className="flex gap-2">
        {patternIndices.map((patternIndex) => (
          <li key={patternIndex}>
            <button
              className="hover bg-slate-100 cursor-pointer px-2"
              value={patternIndex}
              onClick={handleChangeCurrentPatternIndex}
            >
              {patternIndex}
            </button>
          </li>
        ))}
      </ul>

      <button
        className="hover bg-slate-100 cursor-pointer px-2"
        onClick={handleAddNewPattern}
      >
        +
      </button>
    </div>
  );
}
