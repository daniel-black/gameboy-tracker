// import { App } from "@/App";
import { Editor } from "@/components/editor";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Editor />; // This is the main app component
}
