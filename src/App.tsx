import "./app.css";
import { PatternGrid } from "./components/pattern-grid";
import { Patterns } from "./components/patterns";
import { Play } from "./components/play";

export function App() {
  return (
    <div className="font-mono">
      <div className="flex gap-8 p-4">
        <div>
          <Play />
          <Patterns />
        </div>
        <PatternGrid />
      </div>
    </div>
  );
}
