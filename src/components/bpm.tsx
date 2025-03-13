import { useEffect, useState } from "react";
import { tracker, TrackerEventMap } from "../audio/tracker";

export function Bpm() {
  const [bpm, setBpm] = useState(tracker.getBpm());

  useEffect(() => {
    const handleBpmChangeEvent = (eventData: TrackerEventMap["changedBpm"]) => {
      setBpm(eventData.bpm);
    };

    tracker.emitter.on("changedBpm", handleBpmChangeEvent);

    return () => {
      tracker.emitter.off("changedBpm", handleBpmChangeEvent);
    };
  }, []);

  function handleBpmChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newBpm = parseInt(event.target.value, 10);
    tracker.setBpm(newBpm);
  }

  return (
    <div>
      <label htmlFor="bpm">BPM:</label>
      <input id="bpm" type="number" value={bpm} onChange={handleBpmChange} />
    </div>
  );
}
