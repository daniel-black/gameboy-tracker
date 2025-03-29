import { Button } from "./ui/button";
import { PauseIcon, PlayIcon, SquareIcon } from "lucide-react";
import { Loop } from "./loop";
import { usePlayback } from "@/hooks/use-playback";

export function Playback() {
  const {
    playbackState,
    playCurrentPattern,
    playSong,
    pausePlayback,
    stopPlayback,
    resumePlayback,
  } = usePlayback();

  const isPaused = playbackState === "paused";
  const isPlaying = playbackState === "playing";
  const isStopped = playbackState === "stopped";

  return (
    <div className="flex items-center gap-1">
      <Button onClick={playSong}>Play song</Button>
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
  );
}
