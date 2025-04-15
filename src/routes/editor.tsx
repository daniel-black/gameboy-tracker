import { ActivePanel } from "@/components/active-panel";
import { Editor } from "@/components/editor";
import { GlobalControls } from "@/components/global-controls";
import { PatternManager } from "@/components/pattern-manager";
import { Playback } from "@/components/playback";
import { SongManager } from "@/components/song-manager";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/editor")({
  component: EditorPage,
});

function EditorPage() {
  return (
    <div className="h-screen w-full flex flex-row gap-4 p-4 overflow-hidden">
      <div className="h-full">
        <Editor />
      </div>
      <div className="flex-1 flex flex-row gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <Playback />
          <GlobalControls />
          <ActivePanel />
        </div>
        <div className="flex flex-col gap-4 min-w-44">
          <PatternManager />
          <SongManager />
        </div>
      </div>
    </div>
  );
}
