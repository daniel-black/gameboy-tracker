import { ChannelLabel } from "./channel-label";

export function PatternHeader() {
  return (
    <div className="fixed top-0 z-10 flex bg-secondary h-[4vh] items-center border shadow-sm">
      {/* This first div is the width of the row numbers column */}
      <div className="w-[32px]" />

      <div className="w-[231px] px-3 font-bold space-x-3">
        <ChannelLabel channel="pulse1" />
      </div>
      <div className="w-[231px] px-3 font-bold space-x-3">
        <ChannelLabel channel="pulse2" />
      </div>
      <div className="w-[265px] px-3 font-bold space-x-3">
        <ChannelLabel channel="wave" />
      </div>
      <div className="w-[122px] px-3 font-bold space-x-3">
        <ChannelLabel channel="noise" />
      </div>
    </div>
  );
}
