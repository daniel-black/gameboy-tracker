import React, { useState, useEffect, useCallback } from "react";

import { tracker } from "../audio/tracker";
import { DEFAULT_BPM, ROWS_PER_PATTERN } from "../audio/constants";
import { TrackerEventMap } from "../audio/events";

// Define button styles
const buttonStyle =
  "px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2";
const activeButtonStyle =
  "px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2";
const disabledButtonStyle =
  "px-3 py-2 bg-gray-100 text-gray-400 rounded mr-2 cursor-not-allowed";

export const PlaybackControls: React.FC = () => {
  // State to track playback status
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [bpm, setBpm] = useState<number>(DEFAULT_BPM);
  const [isLooping, setIsLooping] = useState(false);
  const [currentRow, setCurrentRow] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false); // New state to track async operations

  // Optional: state for selection
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(ROWS_PER_PATTERN - 1);

  // Listen for tracker events
  useEffect(() => {
    // Update UI when playback starts
    const handleStartedPlayback = (
      eventData: TrackerEventMap["startedPlayback"]
    ) => {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentRow(eventData.row);
      setIsTransitioning(false);
    };

    // Update UI when playback pauses
    const handlePausedPlayback = (
      eventData: TrackerEventMap["pausedPlayback"]
    ) => {
      setIsPlaying(false);
      setIsPaused(true);
      setCurrentRow(eventData.row);
      setIsTransitioning(false);
    };

    // Update UI when playback resumes
    const handleResumedPlayback = (
      eventData: TrackerEventMap["resumedPlayback"]
    ) => {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentRow(eventData.row);
    };

    // Update UI when playback stops
    const handleStoppedPlayback = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentRow(0);
      setIsTransitioning(false);
    };

    // Update current row during playback
    const handlePlayedRow = (eventData: TrackerEventMap["playedRow"]) => {
      setCurrentRow(eventData.row);
    };

    // Update BPM when changed
    const handleChangedBpm = (eventData: TrackerEventMap["changedBpm"]) => {
      setBpm(eventData.bpm);
    };

    // Register all event listeners
    tracker.emitter.on("startedPlayback", handleStartedPlayback);
    tracker.emitter.on("pausedPlayback", handlePausedPlayback);
    tracker.emitter.on("resumedPlayback", handleResumedPlayback);
    tracker.emitter.on("stoppedPlayback", handleStoppedPlayback);
    tracker.emitter.on("playedRow", handlePlayedRow);
    tracker.emitter.on("changedBpm", handleChangedBpm);

    // Clean up event listeners on unmount
    return () => {
      tracker.emitter.off("startedPlayback", handleStartedPlayback);
      tracker.emitter.off("pausedPlayback", handlePausedPlayback);
      tracker.emitter.off("resumedPlayback", handleResumedPlayback);
      tracker.emitter.off("stoppedPlayback", handleStoppedPlayback);
      tracker.emitter.off("playedRow", handlePlayedRow);
      tracker.emitter.off("changedBpm", handleChangedBpm);
    };
  }, []);

  // Handle BPM change
  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = Number(e.target.value);
    if (!isNaN(newBpm) && newBpm > 0) {
      setBpm(newBpm);
      tracker.setBpm(newBpm);
    }
  };

  // Playback controls
  const handlePlay = useCallback(async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    try {
      if (isPaused) {
        await tracker.resume();
      } else {
        console.log("Starting playback with looping:", isLooping); // Debug log
        await tracker.playCurrentPattern({ isLooping });
      }
    } catch (error) {
      console.error("Error during play:", error);
      setIsTransitioning(false);
    }
  }, [isPaused, isLooping, isTransitioning]);

  const handlePlaySection = useCallback(async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    try {
      console.log("Playing section with looping:", isLooping); // Debug log
      await tracker.playSection(selectionStart, selectionEnd, isLooping);
    } catch (error) {
      console.error("Error during play section:", error);
      setIsTransitioning(false);
    }
  }, [selectionStart, selectionEnd, isLooping, isTransitioning]);

  const handlePlaySong = useCallback(async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    try {
      console.log("Playing song with looping:", isLooping); // Debug log
      await tracker.playSong(isLooping);
    } catch (error) {
      console.error("Error during play song:", error);
      setIsTransitioning(false);
    }
  }, [isLooping, isTransitioning]);

  const handlePause = useCallback(async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    try {
      await tracker.pause();
    } catch (error) {
      console.error("Error during pause:", error);
      setIsTransitioning(false);
    }
  }, [isTransitioning]);

  const handleStop = useCallback(async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    try {
      await tracker.stop();
    } catch (error) {
      console.error("Error during stop:", error);
      setIsTransitioning(false);
    }
  }, [isTransitioning]);

  // Handle loop toggle
  const handleLoopToggle = () => {
    const newLoopingState = !isLooping;
    console.log("Setting looping to:", newLoopingState); // Debug log
    setIsLooping(newLoopingState);
  };

  // Handle selection changes
  const handleSelectionStartChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0 && value < ROWS_PER_PATTERN) {
      setSelectionStart(value);
    }
  };

  const handleSelectionEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0 && value < ROWS_PER_PATTERN) {
      setSelectionEnd(value);
    }
  };

  // Get appropriate button style based on state
  const getButtonStyle = (isActive: boolean, isEnabled: boolean) => {
    if (!isEnabled) return disabledButtonStyle;
    return isActive ? activeButtonStyle : buttonStyle;
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <div className="flex items-center mb-4">
        {/* Play/Pause Button */}
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className={getButtonStyle(isPlaying, !isTransitioning)}
          disabled={isTransitioning}
        >
          {isTransitioning ? "..." : isPlaying ? "Pause" : "Play"}
        </button>

        {/* Stop Button */}
        <button
          onClick={handleStop}
          className={getButtonStyle(
            false,
            !isTransitioning && (isPlaying || isPaused)
          )}
          disabled={isTransitioning || (!isPlaying && !isPaused)}
        >
          Stop
        </button>

        {/* Play Section Button */}
        <button
          onClick={handlePlaySection}
          className={getButtonStyle(false, !isTransitioning)}
          disabled={isTransitioning}
        >
          Play Selection
        </button>

        {/* Play Song Button */}
        <button
          onClick={handlePlaySong}
          className={getButtonStyle(false, !isTransitioning)}
          disabled={isTransitioning}
        >
          Play Song
        </button>

        {/* Loop Toggle */}
        <label className="flex items-center ml-4">
          <input
            type="checkbox"
            checked={isLooping}
            onChange={handleLoopToggle}
            className="mr-2"
          />
          <span className="text-sm">Loop</span>
        </label>

        {/* BPM Control */}
        <div className="ml-6 flex items-center">
          <label htmlFor="bpm-input" className="mr-2 text-sm">
            BPM:
          </label>
          <input
            id="bpm-input"
            type="number"
            value={bpm}
            onChange={handleBpmChange}
            min="20"
            max="300"
            className="w-16 p-1 border rounded"
          />
        </div>
      </div>

      {/* Selection Controls */}
      <div className="flex items-center space-x-4">
        <div>
          <label htmlFor="selection-start" className="text-sm block">
            Selection Start:
          </label>
          <input
            id="selection-start"
            type="number"
            value={selectionStart}
            onChange={handleSelectionStartChange}
            min="0"
            max={ROWS_PER_PATTERN - 1}
            className="w-16 p-1 border rounded"
          />
        </div>

        <div>
          <label htmlFor="selection-end" className="text-sm block">
            Selection End:
          </label>
          <input
            id="selection-end"
            type="number"
            value={selectionEnd}
            onChange={handleSelectionEndChange}
            min="0"
            max={ROWS_PER_PATTERN - 1}
            className="w-16 p-1 border rounded"
          />
        </div>
      </div>

      {/* Playback Position Indicator */}
      <div className="mt-4">
        <div className="text-sm text-gray-500">Current Row: {currentRow}</div>
        <div className="mt-1 bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-500 h-full rounded-full"
            style={{ width: `${(currentRow / ROWS_PER_PATTERN) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
