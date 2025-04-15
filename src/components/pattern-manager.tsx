import { ScrollArea } from "@radix-ui/react-scroll-area";
// import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { tracker } from "@/audio/tracker";
import { TrackerEventMap } from "@/audio/events";
import { PatternMetadata } from "@/audio/types";
// import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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

  // function addNewPattern() {
  //   tracker.addPattern();
  // }

  function setCurrentPattern(patternId: string) {
    tracker.setCurrentPatternId(patternId);
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Pattern Manager</CardTitle>
        <CardDescription>
          Manage the patterns that make up your song.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full w-full rounded-md border">
          <div className="p-2">
            {patternsData.map((pattern) => (
              <div key={pattern.id}>
                <span
                  onClick={() => setCurrentPattern(pattern.id)}
                  className={`text-xs ${
                    pattern.id === currentPatternId
                      ? "bg-green-200 rounded"
                      : ""
                  }`}
                >
                  {pattern.name}
                </span>
                <Separator className="my-1" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>

    // <div className="border p-1 rounded">
    //   <div className="flex items-center justify-between p-2 text-sm">
    //     <h3>Patterns</h3>
    //     <Button onClick={addNewPattern} size="sm" variant="secondary">
    //       <PlusIcon className="size-3" />
    //     </Button>
    //   </div>

    // </div>
  );
}
