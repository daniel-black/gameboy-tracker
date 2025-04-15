import { TrackerEventMap } from "@/audio/events";
import { tracker } from "@/audio/tracker";
import { useCallback, useEffect, useState } from "react";

type PlaybackState = "stopped" | "playing" | "paused";

export function usePlayback() {
  const [playbackState, setPlaybackState] = useState<PlaybackState>("stopped");
  const [currentPlaybackRow, setCurrentPlaybackRow] = useState<number | null>(
    null
  );

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
      setCurrentPlaybackRow(null);
    };

    const handleRowChangedEvent = (
      event: TrackerEventMap["changedPlaybackRow"]
    ) => {
      setCurrentPlaybackRow(event.row);
    };

    tracker.emitter.on("startedPlayback", handleStartedPlaybackEvent);
    tracker.emitter.on("pausedPlayback", handlePausedPlaybackEvent);
    tracker.emitter.on("resumedPlayback", handleResumedPlaybackEvent);
    tracker.emitter.on("stoppedPlayback", handleStoppedPlaybackEvent);
    tracker.emitter.on("changedPlaybackRow", handleRowChangedEvent);

    return () => {
      tracker.emitter.off("startedPlayback", handleStartedPlaybackEvent);
      tracker.emitter.off("pausedPlayback", handlePausedPlaybackEvent);
      tracker.emitter.off("resumedPlayback", handleResumedPlaybackEvent);
      tracker.emitter.off("stoppedPlayback", handleStoppedPlaybackEvent);
      tracker.emitter.off("changedPlaybackRow", handleRowChangedEvent);
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

  const playSection = useCallback(async (start: number, end: number) => {
    await tracker.play({
      startRow: start,
      endRow: end,
    });
  }, []);

  const pausePlayback = useCallback(async () => {
    await tracker.pause();
  }, []);

  const resumePlayback = useCallback(async () => {
    await tracker.resume();
  }, []);

  return {
    currentPlaybackRow,
    playbackState,
    stopPlayback,
    pausePlayback,
    playSong,
    playSection,
    playCurrentPattern,
    resumePlayback,
  } as const;
}
