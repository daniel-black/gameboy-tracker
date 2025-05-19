import { ActivePanel } from "@/components/active-panel";
import { GlobalControls } from "@/components/global-controls";
import { Grid } from "@/components/grid";
import { Patterns } from "@/components/patterns";
import { Playback } from "@/components/playback";
import { Song } from "@/components/song";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-row">
      <div>
        <Grid />
      </div>
      <div className="flex-1 bg-secondary px-2 space-y-2">
        <Playback />
        <GlobalControls />
        <ActivePanel />
        <div className="grid grid-cols-2 gap-2">
          <Patterns />
          <Song />
        </div>
      </div>
    </div>
  );
}
