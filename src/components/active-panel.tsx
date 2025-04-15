import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pulse1Expanded } from "./pulse1-expanded";
import { Pulse2Expanded } from "./pulse2-expanded";
import { WaveExpanded } from "./wave-expanded";
import { NoiseExpanded } from "./noise-expanded";
import { useAtomValue } from "jotai";
import { sectionRangeAtom } from "@/store";

export function ActivePanel() {
  const row = useAtomValue(sectionRangeAtom).start ?? 0;

  return (
    <Tabs defaultValue="pulse-wave-1" className="flex-1">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="pulse-wave-1">Pulse Wave 1</TabsTrigger>
        <TabsTrigger value="pulse-wave-2">Pulse Wave 2</TabsTrigger>
        <TabsTrigger value="wave">Wave</TabsTrigger>
        <TabsTrigger value="noise">Noise</TabsTrigger>
      </TabsList>

      <TabsContent value="pulse-wave-1">
        <Pulse1Expanded row={row} key={`pulse1-expanded-${row}`} />
      </TabsContent>
      <TabsContent value="pulse-wave-2">
        <Pulse2Expanded row={row} key={`pulse2-expanded-${row}`} />
      </TabsContent>
      <TabsContent value="wave">
        <WaveExpanded row={row} key={`wave-expanded-${row}`} />
      </TabsContent>
      <TabsContent value="noise">
        <NoiseExpanded row={row} key={`noise-expanded-${row}`} />
      </TabsContent>
    </Tabs>
  );
}
