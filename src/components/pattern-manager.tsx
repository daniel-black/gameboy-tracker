import { ScrollArea } from "@radix-ui/react-scroll-area";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { tracker } from "@/audio/tracker";
import { TrackerEventMap } from "@/audio/events";
import { PatternMetadata } from "@/audio/types";
import { Button } from "./ui/button";

export function PatternManager() {
  const [currentPatternId, setCurrentPatternId] = useState(
    tracker.getCurrentPatternId()
  );
  const [patternsData, setPatternsData] = useState<PatternMetadata[]>(
    tracker.getAllPatternsMetadata()
  );

  useEffect(() => {
    const handleCurrentPatternChangedEvent = (
      eventData: TrackerEventMap["changedCurrentPattern"]
    ) => {
      setCurrentPatternId(eventData.patternId);
      setPatternsData(tracker.getAllPatternsMetadata());
    };

    tracker.emitter.on(
      "changedCurrentPattern",
      handleCurrentPatternChangedEvent
    );

    return () => {
      tracker.emitter.off(
        "changedCurrentPattern",
        handleCurrentPatternChangedEvent
      );
    };
  }, []);

  function addNewPattern() {
    tracker.addPattern();
  }

  function setCurrentPattern(patternId: string) {
    tracker.setCurrentPatternId(patternId);
  }

  return (
    <div className="border p-1">
      <div className="flex items-center justify-between p-2">
        <h3>Patterns</h3>
        <Button onClick={addNewPattern} size="icon">
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="h-72 w-56 rounded-md border">
        <div className="p-4">
          {patternsData.map((pattern) => (
            <div key={pattern.id}>
              <div className="flex items-center justify-between">
                <span
                  onClick={() => setCurrentPattern(pattern.id)}
                  className={`text-sm ${
                    pattern.id === currentPatternId
                      ? "bg-green-200 rounded"
                      : ""
                  }`}
                >
                  {pattern.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {pattern.id}
                </span>
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
