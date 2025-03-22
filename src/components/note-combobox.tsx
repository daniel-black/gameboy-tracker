import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Note, NOTE_FREQUENCY } from "@/audio/notes";

// Create groups of notes by octave and add special notes
const specialNotes = [
  { value: "OFF", label: "OFF" },
  { value: "---", label: "---" },
];

// Convert NOTE_FREQUENCY object to structured data grouped by octave
const notesByOctave = {
  Special: specialNotes,
  "Octave 2": Object.keys(NOTE_FREQUENCY)
    .filter((note) => note.includes("2"))
    .map((note) => ({ value: note, label: note })),
  "Octave 3": Object.keys(NOTE_FREQUENCY)
    .filter((note) => note.includes("3"))
    .map((note) => ({ value: note, label: note })),
  "Octave 4": Object.keys(NOTE_FREQUENCY)
    .filter((note) => note.includes("4"))
    .map((note) => ({ value: note, label: note })),
  "Octave 5": Object.keys(NOTE_FREQUENCY)
    .filter((note) => note.includes("5"))
    .map((note) => ({ value: note, label: note })),
  "Octave 6": Object.keys(NOTE_FREQUENCY)
    .filter((note) => note.includes("6"))
    .map((note) => ({ value: note, label: note })),
  "Octave 7": Object.keys(NOTE_FREQUENCY)
    .filter((note) => note.includes("7"))
    .map((note) => ({ value: note, label: note })),
};

// Flatten all notes for search functionality
const allNotes = Object.values(notesByOctave).flat();

export function NoteCombobox({
  note,
  handleNoteChange,
}: {
  note: Note;
  handleNoteChange: (newNote: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [noteValue, setNoteValue] = useState<string>(note);

  // Get the display label for the selected value
  const getSelectedNoteLabel = () => {
    const selectedNote = allNotes.find((note) => note.value === noteValue);
    return selectedNote ? selectedNote.label : "Note";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[90px] justify-between"
        >
          {getSelectedNoteLabel()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[90px] p-0">
        <Command>
          <CommandInput placeholder="Note" />
          <CommandList>
            <CommandEmpty>None</CommandEmpty>
            {Object.entries(notesByOctave).map(([group, notes]) => (
              <CommandGroup key={group} heading={group}>
                {notes.map((note) => (
                  <CommandItem
                    key={note.value}
                    value={note.value}
                    onSelect={(currentNoteValue: string) => {
                      const newNoteValue =
                        currentNoteValue === noteValue ? "" : currentNoteValue;
                      setNoteValue(newNoteValue);
                      handleNoteChange(newNoteValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        noteValue === note.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {note.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
