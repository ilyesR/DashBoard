/**
 * Authored icon set. One geometry: 20-unit box, 1.5 stroke, round caps,
 * square-ish corners at 1.5 radius. Drawn for this world rather than borrowed,
 * so the stroke weight agrees with the hairlines everywhere else.
 */
type IconProps = { className?: string; size?: number };

function Svg({ children, className, size = 18 }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** The board: accounts as peer plates. */
export const IconBoard = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="3" width="6.5" height="6" rx="1.5" />
    <rect x="11" y="3" width="6.5" height="6" rx="1.5" />
    <rect x="2.5" y="11" width="6.5" height="6" rx="1.5" />
    <rect x="11" y="11" width="6.5" height="6" rx="1.5" />
  </Svg>
);

/** The ledger: ruled lines with values at the right. */
export const IconLedger = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 5h9M2.5 10h9M2.5 15h9" />
    <path d="M15 4.5v3M15 9.5v3M15 14.5v1" />
  </Svg>
);

/** Work: a folded plan sheet. */
export const IconWork = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.75 5.5A1.5 1.5 0 0 1 4.25 4h3.1a1.5 1.5 0 0 1 1.2.6l.9 1.2h6.3a1.5 1.5 0 0 1 1.5 1.5v7.2a1.5 1.5 0 0 1-1.5 1.5H4.25a1.5 1.5 0 0 1-1.5-1.5z" />
    <path d="M6.5 11.5h7" />
  </Svg>
);

/** The queue: an open tray things drop into. */
export const IconQueue = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.75 11.5h3.1l1.1 2h6.1l1.1-2h3.1" />
    <path d="M2.75 11.5 5 4.6a1.5 1.5 0 0 1 1.42-1.1h7.16A1.5 1.5 0 0 1 15 4.6l2.25 6.9v3.4a1.5 1.5 0 0 1-1.5 1.5H4.25a1.5 1.5 0 0 1-1.5-1.5z" />
  </Svg>
);

/** Rates: two currencies crossing. */
export const IconExchange = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 7h11.5M11.5 3.75 14.75 7 11.5 10.25" />
    <path d="M17 13H5.5M8.5 9.75 5.25 13l3.25 3.25" />
  </Svg>
);

/** Connections: a bank line into the ledger. */
export const IconLink = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8.5 11.5a3 3 0 0 0 4.24 0l2.4-2.4a3 3 0 1 0-4.24-4.25l-.85.85" />
    <path d="M11.5 8.5a3 3 0 0 0-4.24 0l-2.4 2.4a3 3 0 1 0 4.24 4.25l.85-.85" />
  </Svg>
);

export const IconSearch = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="9" r="5.25" />
    <path d="m13.25 13.25 3.25 3.25" />
  </Svg>
);

export const IconArrow = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 10h11.5M11.75 6.25 15.5 10l-3.75 3.75" />
  </Svg>
);

export const IconPlus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10 4.25v11.5M4.25 10h11.5" />
  </Svg>
);

export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4.5 10.5 3.5 3.5 7.5-8" />
  </Svg>
);

export const IconChevron = (p: IconProps) => (
  <Svg {...p}>
    <path d="m7.5 4.5 5.5 5.5-5.5 5.5" />
  </Svg>
);

export const IconChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 8 5 5 5-5" />
  </Svg>
);

export const IconSync = (p: IconProps) => (
  <Svg {...p}>
    <path d="M16.25 8.5A6.25 6.25 0 0 0 5.2 5.6M3.75 11.5a6.25 6.25 0 0 0 11.05 2.9" />
    <path d="M16.25 4.25V8.5h-4.25M3.75 15.75V11.5H8" />
  </Svg>
);

export const IconHand = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.25 6.5h11.5M4.25 10h7.5M4.25 13.5h4.5" />
  </Svg>
);

/**
 * The mark. A meridian: one line, two places measured against it.
 * `id` must differ per instance — two identical gradient ids in one document
 * and the second mark renders empty.
 */
export function Mark({ size = 26, id = "mk" }: { size?: number; id?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect width="28" height="28" rx="8" fill={`url(#${id})`} />
      <path
        d="M14 5.5v17"
        stroke="#04160F"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M7.5 17.5c2.6 0 2.6-7 5.2-7s2.6 7 5.2 7 2.6-4 2.6-4"
        stroke="#04160F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5CF0BD" />
          <stop offset="1" stopColor="#17B589" />
        </linearGradient>
      </defs>
    </svg>
  );
}
