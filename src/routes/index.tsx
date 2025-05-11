import { ActiveInput } from "@/components/active-input";
import { GlobalControls } from "@/components/global-controls";
import { Grid } from "@/components/grid";
import { Playback } from "@/components/playback";
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
      <div className="flex-1 bg-secondary px-2">
        <Playback />
        <GlobalControls />
        <ActiveInput />
      </div>
    </div>
  );
}
