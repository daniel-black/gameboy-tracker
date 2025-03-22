import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function Playback() {
  const [playbackState, setPlaybackState] = useState<
    "stopped" | "playing" | "paused"
  >("stopped");

  useEffect(() => {
    const handleStartedPlaybackEvent = (
      _: TrackerEventMap["startedPlayback"]
    ) => {
      setPlaybackState("playing");
    };

    const handlePausedPlaybackEvent = (
      _: TrackerEventMap["pausedPlayback"]
    ) => {
      setPlaybackState("paused");
    };

    const handleResumedPlaybackEvent = (
      _: TrackerEventMap["resumedPlayback"]
    ) => {
      setPlaybackState("playing");
    };

    const handleStoppedPlaybackEvent = (
      _: TrackerEventMap["stoppedPlayback"]
    ) => {
      setPlaybackState("stopped");
    };

    tracker.emitter.on("startedPlayback", handleStartedPlaybackEvent);
    tracker.emitter.on("pausedPlayback", handlePausedPlaybackEvent);
    tracker.emitter.on("resumedPlayback", handleResumedPlaybackEvent);
    tracker.emitter.on("stoppedPlayback", handleStoppedPlaybackEvent);

    return () => {
      tracker.emitter.off("startedPlayback", handleStartedPlaybackEvent);
      tracker.emitter.off("pausedPlayback", handlePausedPlaybackEvent);
      tracker.emitter.off("resumedPlayback", handleResumedPlaybackEvent);
      tracker.emitter.off("stoppedPlayback", handleStoppedPlaybackEvent);
    };
  }, []);

  async function handleStop() {
    await tracker.stop();
  }

  async function handlePlay() {
    await tracker.play();
  }

  async function handlePause() {
    await tracker.pause();
  }

  async function handleResume() {
    await tracker.resume();
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={async () => {
          if (playbackState === "paused") {
            await handleResume();
          } else {
            await handlePlay();
          }
        }}
        disabled={playbackState === "playing"}
      >
        {playbackState === "paused" ? "Resume" : "Play"}
      </Button>
      <Button
        onClick={handlePause}
        disabled={playbackState === "stopped" || playbackState === "paused"}
      >
        Pause
      </Button>
      <Button onClick={handleStop} disabled={playbackState === "stopped"}>
        Stop
      </Button>
    </div>
  );
}
