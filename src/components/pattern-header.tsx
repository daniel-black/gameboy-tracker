import { ChannelToggle } from "./channel-toggle";

export function PatternHeader() {
  return (
    <div className="sticky top-0 z-10 flex bg-secondary h-12 items-center border shadow-sm">
      <div className="w-[46px]"></div>
      <div className="w-[298px] px-3 font-bold space-x-3">
        <ChannelToggle channel="pulse1" />
        <span>Pulse Wave 1</span>
      </div>
      <div className="w-[298px] px-3 font-bold space-x-3">
        <ChannelToggle channel="pulse2" />
        <span>Pulse Wave 2</span>
      </div>
      <div className="w-[333px] px-3 font-bold space-x-3">
        <ChannelToggle channel="wave" />
        <span>Wave</span>
      </div>
      <div className="w-fit px-3 font-bold space-x-3">
        <ChannelToggle channel="noise" />
        <span>Noise</span>
      </div>
    </div>
  );
}
