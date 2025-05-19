import { usePatterns } from "@/hooks/use-patterns";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";

export function Patterns() {
  const {
    currentPatternId,
    patterns,
    addNewPattern,
    deletePattern,
    setCurrentPattern,
  } = usePatterns();

  return (
    <Card>
      <CardHeader>Patterns</CardHeader>
      <CardContent className="text-xs">
        <div className="space-y-2">
          <ul className="space-y-1.5">
            {patterns.map((pattern) => (
              <li key={pattern.id}>
                <div
                  data-is-active={pattern.id === currentPatternId}
                  className="flex flex-row items-center justify-between bg-secondary p-0.5 data-[is-active=true]:bg-pink-200 cursor-pointer"
                  onMouseDown={() => setCurrentPattern(pattern.id)}
                >
                  <span>{pattern.name}</span>
                  <span>{pattern.id}</span>
                  <Button
                    size={"icon"}
                    variant="ghost"
                    className="w-6 h-6 hover:bg-destructive hover:text-white"
                    onClick={() => deletePattern(pattern.id)}
                  >
                    <TrashIcon className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <Button size="sm" className="" onClick={addNewPattern}>
            Add new pattern
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
