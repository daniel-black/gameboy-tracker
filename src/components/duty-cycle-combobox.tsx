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
import { DutyCycle } from "@/audio/wave-shaper";

const dutyCycles = [
  {
    label: "12.5%",
    value: 0.125,
  },
  {
    label: "25%",
    value: 0.25,
  },
  {
    label: "50%",
    value: 0.5,
  },
  {
    label: "75%",
    value: 0.75,
  },
] as const;

type DutyCycleLabel = (typeof dutyCycles)[number]["label"];

type DutyCycleComboboxProps = {
  dutyCycle: DutyCycle;
  handleDutyCycleChange: (newDutyCycle: DutyCycle) => void;
};

export function DutyCycleCombobox(props: DutyCycleComboboxProps) {
  const [open, setOpen] = useState(false);
  const [dutyCycleValue, setDutyCycleValue] = useState<DutyCycle>(
    props.dutyCycle
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[80px] justify-between"
        >
          {dutyCycleValue
            ? dutyCycles.find((cycle) => cycle.value === dutyCycleValue)!.label
            : "Duty"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[80px] p-0">
        <Command>
          <CommandInput placeholder="Duty" className="h-9" />
          <CommandList>
            <CommandEmpty>None</CommandEmpty>
            <CommandGroup>
              {dutyCycles.map((dutyCycle) => (
                <CommandItem
                  key={dutyCycle.value}
                  value={dutyCycle.label}
                  onSelect={(currentDutyCycleLabelValue: DutyCycleLabel) => {
                    const newDutyCycleValue = dutyCycles.find(
                      (cycle) => cycle.label === currentDutyCycleLabelValue
                    )!.value as DutyCycle;
                    setDutyCycleValue(newDutyCycleValue);
                    props.handleDutyCycleChange(newDutyCycleValue);
                    setOpen(false);
                  }}
                >
                  {dutyCycle.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      dutyCycleValue === dutyCycle.value
                        ? "opacity-100"
                        : "opacity-0"
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
