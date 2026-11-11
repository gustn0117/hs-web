import type { CSSProperties } from "react";

const paths = {
  home: "m3 10 9-7 9 7v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z",
  project:
    "M4 5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm4 16h8M12 18v3M7 10l2 2-2 2m5 0h4",
  wallet:
    "M20 8V5a2 2 0 0 0-2-2H6a3 3 0 0 0 0 6h14a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6m18 7h-5v4h5m-3-2h.01",
  bag: "M5 7h14l2 14H3L5 7Zm3 1V6a4 4 0 0 1 8 0v2",
  settings:
    "M9 4.5 10 2h4l1 2.5 2 .9 2.7-.4 2 3.5-1.7 2.1v2.8l1.7 2.1-2 3.5-2.7-.4-2 .9-1 2.5h-4l-1-2.5-2-.9-2.7.4-2-3.5L4 13.4v-2.8L2.3 8.5l2-3.5 2.7.4 2-.9ZM15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 13h4",
  arrow: "m9 5 7 7-7 7",
  back: "m15 5-7 7 7 7",
  check: "m5 12 4 4L19 6",
  shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6",
  server:
    "M5 3h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 10h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Zm2-6h.01M7 17h.01M11 7h6m-6 10h6",
  globe:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c4 5 4 13 0 18-4-5-4-13 0-18Z",
  receipt: "M6 3h12v19l-3-2-3 2-3-2-3 2V3Zm3 5h6m-6 4h6m-6 4h3",
  sparkles:
    "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4",
  logout: "M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4m7-13 5 5-5 5M8 12h13",
  help: "M21 11.5a8.5 8.5 0 0 1-9 8.5c-1.4 0-2.7-.3-3.8-.8L3 21l1.6-5A8.5 8.5 0 1 1 21 11.5ZM9.5 9a2.5 2.5 0 1 1 4 2c-1.5.8-1.5 1-1.5 2m0 3h.01",
  lock: "M6 10h12a2 2 0 0 1 2 2v8H4v-8a2 2 0 0 1 2-2Zm2 0V6a4 4 0 0 1 8 0v4m-4 5v2",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  close: "m6 6 12 12M6 18 18 6",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2",
} as const;

export type PortalIconName = keyof typeof paths;

export default function PortalIcon({
  name,
  className,
  style,
}: {
  name: PortalIconName;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
