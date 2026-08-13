"use client";

import type { AccountStatus } from "@/lib/types";

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  size = "md",
}: {
  value: T;
  options: { value: T; label: string; title?: string }[];
  onChange: (v: T) => void;
  label: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-lg border border-rule bg-plate p-0.5"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={o.title}
            onClick={() => onChange(o.value)}
            className={[
              "rounded-[6px] font-medium transition-colors duration-150",
              size === "sm" ? "px-2 py-[3px] text-[11.5px]" : "px-2.5 py-[5px] text-[12.5px]",
              active
                ? "bg-plate-3 text-ink shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
                : "text-faint hover:text-muted",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

const STATUS_COPY: Record<AccountStatus, { label: string; tone: string }> = {
  active: { label: "Active", tone: "text-mint" },
  wrapping: { label: "Wrapping up", tone: "text-amber" },
  dormant: { label: "Dormant", tone: "text-faint" },
  closed: { label: "Closed", tone: "text-faint" },
  self: { label: "You", tone: "text-rose" },
};

const STATUS_FILL: Record<AccountStatus, string> = {
  active: "bg-mint",
  wrapping: "bg-amber",
  dormant: "bg-faint",
  closed: "bg-faint",
  self: "bg-rose",
};

export function StatusDot({ status }: { status: AccountStatus }) {
  return (
    <span
      className={`inline-block size-[6px] shrink-0 rounded-full ${STATUS_FILL[status]}`}
      aria-hidden="true"
    />
  );
}

export function StatusLabel({ status }: { status: AccountStatus }) {
  const s = STATUS_COPY[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-medium ${s.tone}`}>
      <StatusDot status={status} />
      {s.label}
    </span>
  );
}

export function Chip({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "mint" | "amber" | "rose" }) {
  const tones = {
    neutral: "border-rule text-faint",
    mint: "border-mint-deep bg-mint-deep/60 text-mint",
    amber: "border-amber-deep bg-amber-deep/60 text-amber",
    rose: "border-rose-deep bg-rose-deep/60 text-rose",
  } as const;
  return (
    <span
      className={`tnum inline-flex items-center rounded-[5px] border px-1.5 py-px text-[10.5px] font-medium tracking-[0.04em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-rule px-5 py-4 lg:h-[62px] lg:flex-nowrap lg:items-center lg:py-0 xl:px-7">
      <div className="min-w-0">
        <h1 className="truncate text-[17px] font-semibold tracking-[-0.015em] text-ink">{title}</h1>
        {meta ? <div className="mt-1 text-[12px] text-faint lg:mt-0.5">{meta}</div> : null}
      </div>
      {children ? <div className="flex shrink-0 items-center gap-2.5">{children}</div> : null}
    </header>
  );
}
