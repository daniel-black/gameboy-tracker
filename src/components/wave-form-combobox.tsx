import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { WAVE_FORMS } from "@/audio/constants";
import { WaveForm } from "@/audio/cell";

type WaveformComboboxProps = {
  waveForm: WaveForm;
  handleWaveFormChange: (newWaveForm: WaveForm) => void;
};

export function WaveFormCombobox(props: WaveformComboboxProps) {
  const [open, setOpen] = useState(false);
  const [waveForm, setWaveForm] = useState(props.waveForm);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100px] justify-between h-6 rounded-sm text-xs px-1.5 py-1"
        >
          {WAVE_FORMS.find((wf) => wf === waveForm) ?? "Wave"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[100px] p-0">
        <Command>
          <CommandInput placeholder="Wave" className="h-9" />
          <CommandList>
            <CommandEmpty>None</CommandEmpty>
            <CommandGroup>
              {WAVE_FORMS.map((wf) => (
                <CommandItem
                  key={wf}
                  value={wf}
                  onSelect={(currentWaveForm: WaveForm) => {
                    console.log({ currentWaveForm, wf });
                    let newWaveForm = wf;

                    setWaveForm(newWaveForm);
                    props.handleWaveFormChange(newWaveForm);
                    setOpen(false);
                  }}
                  className="text-xs"
                >
                  {wf}
                  <Check
                    className={cn(
                      "ml-auto size-3",
                      wf === waveForm ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
