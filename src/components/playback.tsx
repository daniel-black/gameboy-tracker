import { Button } from "./ui/button";
import { PauseIcon, PlayIcon, SquareIcon } from "lucide-react";
import { Loop } from "./loop";
import { usePlayback } from "@/hooks/use-playback";
import { useAtomValue } from "jotai";
import { selectedStateAtom } from "@/store";
import { Card, CardContent } from "./ui/card";

export function Playback() {
  const {
    playbackState,
    playCurrentPattern,
    // playSong,
    playSection,
    pausePlayback,
    stopPlayback,
    resumePlayback,
  } = usePlayback();

  const isPaused = playbackState === "paused";
  const isPlaying = playbackState === "playing";
  const isStopped = playbackState === "stopped";

  const { start, end } = useAtomValue(selectedStateAtom);

  return (
    <Card className="p-2 w-full">
      <CardContent className="p-0">
        <div className="flex items-center gap-2">
          {start !== null && end !== null && start !== end && (
            <Button onClick={async () => playSection(start, end)}>
              Play Section
            </Button>
          )}
          <Button
            size="icon"
            onClick={async () => {
              if (playbackState === "paused") {
                await resumePlayback();
              } else {
                await playCurrentPattern();
              }
            }}
            disabled={isPlaying}
          >
            <PlayIcon className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={pausePlayback}
            disabled={isStopped || isPaused}
          >
            <PauseIcon className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={stopPlayback}
            disabled={isStopped}
          >
            <SquareIcon className="w-4 h-4" />
          </Button>
          <Loop />
        </div>
      </CardContent>
    </Card>
  );
}
