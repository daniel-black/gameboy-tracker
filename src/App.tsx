import "./app.css";
import { channels } from "./audio/channels";
import { Bpm } from "./components/bpm";
import { ChannelToggle } from "./components/channel-toggle";

export function App() {
  return (
    <div className="font-mono">
      <p>hello from app</p>
      <Bpm />
      <hr />
      <div className="border p-2 space-y-2">
        {channels.map((channel) => (
          <ChannelToggle key={channel} channel={channel} />
        ))}
      </div>
    </div>
  );
}
