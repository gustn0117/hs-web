import { useId } from "react";

/** App-specific vector artwork stays sharp on both web and the native webview. */
export default function PortalIllustration({
  kind = "wallet",
}: {
  kind?: "wallet" | "success" | "services";
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className="portal-illustration"
      width="130"
      height="116"
      viewBox="0 0 156 140"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`${id}-blue`}
          x1="38"
          y1="37"
          x2="119"
          y2="121"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#85B8FF" />
          <stop offset="1" stopColor="#3182F6" />
        </linearGradient>
        <linearGradient
          id={`${id}-light`}
          x1="60"
          y1="18"
          x2="131"
          y2="92"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D5E7FF" />
          <stop offset="1" stopColor="#9BC4FF" />
        </linearGradient>
        <linearGradient
          id={`${id}-coin`}
          x1="105"
          y1="81"
          x2="133"
          y2="119"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFE5A8" />
          <stop offset="1" stopColor="#FFBD5B" />
        </linearGradient>
      </defs>
      <ellipse cx="81" cy="124" rx="48" ry="5" fill="#DDEAFF" opacity=".65" />
      <path
        d="M25 34v8m-4-4h8"
        stroke="#9DC5FF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="134" cy="54" r="3" fill="#BFD8FF" />
      {kind === "services" ? (
        <>
          <rect
            x="59"
            y="18"
            width="67"
            height="69"
            rx="15"
            transform="rotate(14 59 18)"
            fill={`url(#${id}-light)`}
          />
          <rect
            x="29"
            y="48"
            width="84"
            height="66"
            rx="16"
            transform="rotate(-9 29 48)"
            fill={`url(#${id}-blue)`}
          />
          <path
            d="m52 70-9 9 9 9m27-22 9 9-9 9m-14-17-5 20"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="88" y="86" width="39" height="39" rx="13" fill="white" />
          <path
            d="m107.5 93 2.6 7.4 7.4 2.6-7.4 2.6-2.6 7.4-2.6-7.4-7.4-2.6 7.4-2.6 2.6-7.4Z"
            fill="#74A9F8"
          />
        </>
      ) : (
        <>
          <rect
            x="52"
            y="24"
            width="77"
            height="62"
            rx="14"
            transform="rotate(13 52 24)"
            fill={`url(#${id}-light)`}
          />
          <path
            d="m64 39 44 10"
            stroke="white"
            strokeOpacity=".8"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <rect
            x="26"
            y="52"
            width="92"
            height="69"
            rx="17"
            transform="rotate(-9 26 52)"
            fill={`url(#${id}-blue)`}
          />
          <path
            d="m34 64 71-11"
            stroke="white"
            strokeOpacity=".3"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect
            x="88"
            y="72"
            width="34"
            height="24"
            rx="8"
            transform="rotate(-9 88 72)"
            fill="#3078DA"
          />
          <circle cx="100" cy="82" r="3" fill="#C4DEFF" />
          {kind === "success" ? (
            <>
              <circle cx="120" cy="110" r="23" fill="#E3F8EF" />
              <path
                d="m109 110 7 7 14-16"
                stroke="#32B58B"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            <>
              <circle cx="122" cy="107" r="23" fill={`url(#${id}-coin)`} />
              <circle
                cx="122"
                cy="107"
                r="17"
                stroke="#FFF0CE"
                strokeWidth="1.5"
              />
              <path
                d="m111 102 4 12 7-12 7 12 4-12m-22 5h22"
                stroke="#DA973D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </>
      )}
    </svg>
  );
}
