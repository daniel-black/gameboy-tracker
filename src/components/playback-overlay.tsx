import { useEffect, useState } from "react";
import { tracker } from "@/audio/tracker";
import { TrackerEventMap } from "@/audio/events";

export function PlaybackOverlay() {
  const [currentRow, setCurrentRow] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Listen for playback row updates
    const playedRowHandler = (eventData: TrackerEventMap["playedRow"]) => {
      setCurrentRow(eventData.row);
    };

    // Listen for playback state changes
    const startedPlaybackHandler = (
      eventData: TrackerEventMap["startedPlayback"]
    ) => {
      setCurrentRow(eventData.row);
      setIsPlaying(true);
    };

    const stoppedPlaybackHandler = () => {
      setIsPlaying(false);
      setCurrentRow(null);
    };

    const pausedPlaybackHandler = (
      eventData: TrackerEventMap["pausedPlayback"]
    ) => {
      setIsPlaying(false);
      setCurrentRow(eventData.row);
    };

    const resumedPlaybackHandler = (
      eventData: TrackerEventMap["resumedPlayback"]
    ) => {
      setCurrentRow(eventData.row);
      setIsPlaying(true);
    };

    // Register event listeners
    tracker.emitter.on("playedRow", playedRowHandler);
    tracker.emitter.on("startedPlayback", startedPlaybackHandler);
    tracker.emitter.on("stoppedPlayback", stoppedPlaybackHandler);
    tracker.emitter.on("pausedPlayback", pausedPlaybackHandler);
    tracker.emitter.on("resumedPlayback", resumedPlaybackHandler);

    // Clean up event listeners on unmount
    return () => {
      tracker.emitter.off("playedRow", playedRowHandler);
      tracker.emitter.off("startedPlayback", startedPlaybackHandler);
      tracker.emitter.off("stoppedPlayback", stoppedPlaybackHandler);
      tracker.emitter.off("pausedPlayback", pausedPlaybackHandler);
      tracker.emitter.off("resumedPlayback", resumedPlaybackHandler);
    };
  }, []);

  if (!isPlaying) {
    if (currentRow == null) {
      return null;
    }

    return (
      <div
        className="absolute left-0 right-0 h-14 bg-blue-100 opacity-30 pointer-events-none z-10 border-y-2 border-x-2 border-blue-400 transition-transform duration-75"
        style={{
          transform: `translateY(${currentRow * 56}px)`, // 56px = height of row (h-14 = 3.5rem = 56px)
        }}
      />
    );
  }

  if (currentRow == null) {
    return null;
  }

  return (
    <div
      className="absolute left-0 right-0 h-14 bg-blue-200 opacity-30 pointer-events-none z-10 border-y-2 border-x-2 border-blue-400 transition-transform duration-75"
      style={{
        transform: `translateY(${currentRow * 56}px)`, // 56px = height of row (h-14 = 3.5rem = 56px)
      }}
    />
  );
}
