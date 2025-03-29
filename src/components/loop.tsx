import { useLooping } from "@/hooks/use-looping";
import { Toggle } from "./ui/toggle";
import { Repeat2Icon } from "lucide-react";

export function Loop() {
  const [isLooping, toggleLooping] = useLooping();

  return (
    <Toggle variant={"outline"} pressed={isLooping} onClick={toggleLooping}>
      <Repeat2Icon className="w-4 h-4" />
    </Toggle>
  );
}
