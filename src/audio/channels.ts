export const channels = ["pulse1", "pulse2", "wave", "noise"] as const;
export type ChannelType = (typeof channels)[number];
