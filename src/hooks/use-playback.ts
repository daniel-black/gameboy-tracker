import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { useCallback, useEffect, useState } from "react";

type PlaybackState = "stopped" | "playing" | "paused";

export function usePlayback() {
  const [playbackState, setPlaybackState] = useState<PlaybackState>("stopped");

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

  const stopPlayback = useCallback(async () => {
    await tracker.stop();
  }, []);

  const playSong = useCallback(async () => {
    await tracker.playSong();
  }, []);

  const playCurrentPattern = useCallback(async () => {
    await tracker.playCurrentPattern();
  }, []);

  const pausePlayback = useCallback(async () => {
    await tracker.pause();
  }, []);

  const resumePlayback = useCallback(async () => {
    await tracker.resume();
  }, []);

  return {
    playbackState,
    stopPlayback,
    pausePlayback,
    playSong,
    playCurrentPattern,
    resumePlayback,
  } as const;
}
