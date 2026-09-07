import type { SVGProps } from "react";

export type IconName =
  | "arrow"
  | "brain"
  | "calendar"
  | "check"
  | "clock"
  | "ear"
  | "heart"
  | "mail"
  | "map-pin"
  | "memory"
  | "message"
  | "movement"
  | "nerve"
  | "phone"
  | "pulse"
  | "shield"
  | "sparkles"
  | "user"
  | "wave";

type IconProps = SVGProps<SVGSVGElement> & { name: IconName };

export function Icon({ name, ...props }: IconProps) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    brain: (
      <>
        <path d="M9.5 4.2A3.2 3.2 0 0 0 5.3 8a3.8 3.8 0 0 0 .5 7.1A3.2 3.2 0 0 0 9.5 20V4.2ZM14.5 4.2A3.2 3.2 0 0 1 18.7 8a3.8 3.8 0 0 1-.5 7.1 3.2 3.2 0 0 1-3.7 4.9V4.2Z" />
        <path d="M9.5 8H7.8m6.7 3.8h1.8M9.5 15.5H7.8m6.7-8.3h1.7M9.5 12h5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M8 3v4m8-4v4M3.5 10h17m-12 4h.01m3.99 0h.01m3.99 0h.01m-8.01 3h.01m3.99 0h.01" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    ear: (
      <>
        <path d="M6.3 9.6a5.8 5.8 0 1 1 10.8 3c-1.2 2-3.1 2.3-3.4 4.7-.2 1.7-1.3 2.7-2.8 2.7-1.7 0-2.8-1.1-2.8-2.7" />
        <path d="M9.5 10a2.7 2.7 0 1 1 4.4 2.1c-1 .8-1.5 1.4-1.6 2.5" />
      </>
    ),
    heart: (
      <path d="M20.8 9.2c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10a4.7 4.7 0 0 1 8.8-2.3 4.7 4.7 0 0 1 8.8 2.3Z" />
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    "map-pin": (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    memory: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="3" />
        <path d="M9 9h6v6H9zM9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3" />
      </>
    ),
    message: (
      <path d="M20 15a3 3 0 0 1-3 3H9l-5 3v-6a3 3 0 0 1-1-2.2V7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v8Z" />
    ),
    movement: (
      <>
        <circle cx="12" cy="4.5" r="2" />
        <path d="m8 21 2-6-2-4 3-3 3 3 3 1m-3-1-1 4 3 6" />
      </>
    ),
    nerve: (
      <>
        <circle cx="5" cy="12" r="2" />
        <circle cx="19" cy="5" r="2" />
        <circle cx="19" cy="19" r="2" />
        <path d="M7 12h4m0 0 6-6m-6 6 6 6m-6-6 1-7m-1 7 1 7" />
      </>
    ),
    phone: <path d="M8.2 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-3.2l-4-1-1 2.5a13 13 0 0 1-9.3-9.3l2.5-1L8.2 3Z" />,
    pulse: <path d="M3 12h4l2-6 4 12 2-6h6" />,
    shield: (
      <>
        <path d="M12 3 4.5 6v5.5c0 4.7 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.8 7.5-9.5V6L12 3Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
    sparkles: <path d="m12 3 1.4 4.1L17.5 8l-4.1 1.4L12 13.5l-1.4-4.1L6.5 8l4.1-.9L12 3Zm6 10 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13ZM6 14l1 2.8 3 1.2-3 1-1 3-1-3-3-1 3-1.2L6 14Z" />,
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    wave: <path d="M3 12h3l2-5 3 10 3-10 2 5h5" />,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
