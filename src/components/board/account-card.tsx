"use client";

import Link from "next/link";
import { SELF_ACCOUNT_ID } from "@/lib/data";
import { convert, fmtDate, fmtMoney, fmtShort, HUE_VAR, monthLabel } from "@/lib/money";
import type { Account, CurrencyCode, Entry } from "@/lib/types";
import { IconArrow } from "@/components/icons";
import { useDisplayCurrency } from "@/components/currency-context";
import { Chip, StatusLabel } from "@/components/ui";

/** Spending bands: one hue, stepped down. Category identity never adds a colour. */
const catFill = (i: number) =>
  `color-mix(in oklab, var(--color-rose) ${Math.max(100 - i * 9, 20)}%, transparent)`;

function TickStrip({
  values,
  keys,
  fill,
  dimmed,
  height = 28,
  settleKey,
}: {
  values: number[];
  keys: string[];
  fill: string;
  dimmed: boolean;
  height?: number;
  settleKey: number;
}) {
  const peak = Math.max(1, ...values);
  return (
    // Income lands in lumps, not a curve. Ticks on a baseline, one per month,
    // with the empty months still drawn so a gap reads as a gap.
    <div
      className="flex items-end gap-[5px] border-b border-rule"
      style={{ height }}
      aria-hidden="true"
    >
      {values.map((v, i) => (
        <span
          key={`${keys[i]}-${settleKey}`}
          className="rise flex-1 rounded-t-[2px] transition-opacity duration-200"
          style={{
            height: v > 0 ? Math.max(4, (v / peak) * height) : 3,
            background: v > 0 ? fill : "var(--color-rule)",
            opacity: dimmed ? 0.25 : 1,
            animationDelay: `${i * 40}ms`,
          }}
        />
      ))}
    </div>
  );
}

export function AccountCard({
  account,
  entries,
  allEntries,
  keys,
  display,
  focus,
  setFocus,
  settleKey,
  index,
}: {
  account: Account;
  entries: Entry[];
  allEntries: Entry[];
  keys: string[];
  display: CurrencyCode;
  focus: string | null;
  setFocus: (id: string | null) => void;
  settleKey: number;
  index: number;
}) {
  const { rate } = useDisplayCurrency();
  const earned = entries
    .filter((e) => e.amount > 0)
    .reduce((t, e) => t + convert(e.amount, e.currency, display, rate), 0);
  const earnedNative = entries
    .filter((e) => e.amount > 0)
    .reduce((t, e) => t + convert(e.amount, e.currency, account.currency, rate), 0);

  const perMonth = keys.map((k) =>
    entries
      .filter((e) => e.date.startsWith(k) && e.amount > 0)
      .reduce((t, e) => t + convert(e.amount, e.currency, display, rate), 0),
  );

  const forAccount = allEntries.filter((e) => e.accountId === account.id);
  const allTime = forAccount
    .filter((e) => e.amount > 0)
    .reduce((t, e) => t + convert(e.amount, e.currency, account.currency, rate), 0);
  const progress = account.contracted ? Math.min(1, allTime / account.contracted) : null;
  const monthsPaid = perMonth.filter((v) => v > 0).length;
  // A month with no payment before the first one ever arrived is not a gap.
  const firstPaid = perMonth.findIndex((v) => v > 0);
  const lastPaid = perMonth.length - 1 - [...perMonth].reverse().findIndex((v) => v > 0);
  const interiorGaps =
    firstPaid === -1 ? 0 : perMonth.slice(firstPaid, lastPaid + 1).filter((v) => v === 0).length;
  const last = [...forAccount].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  const dimmed = focus !== null && focus !== account.id;
  const hue = HUE_VAR[account.hue];

  return (
    <Link
      href={`/projects/${account.id}`}
      onMouseEnter={() => setFocus(account.id)}
      onMouseLeave={() => setFocus(null)}
      onFocus={() => setFocus(account.id)}
      onBlur={() => setFocus(null)}
      style={{ animationDelay: `${index * 45}ms` }}
      className={[
        "settle group plate relative flex flex-col p-4 transition-[opacity,border-color,background-color] duration-200",
        "hover:border-plate-3 hover:bg-plate-2 focus-visible:border-plate-3",
        dimmed ? "opacity-45" : "opacity-100",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold tracking-[-0.01em] text-ink">
            {account.client}
          </div>
          <div className="mt-0.5 truncate text-[12px] text-muted">
            {account.name} · {account.place}
          </div>
        </div>
        <Chip>{account.currency}</Chip>
      </div>

      <div className="mt-4">
        {earned > 0 ? (
          <>
            <div
              key={`${account.id}-${settleKey}`}
              className="tnum text-[26px] font-semibold leading-none tracking-[-0.025em] text-ink"
            >
              {fmtMoney(earned, display)}
            </div>
            {account.currency !== display ? (
              <div className="tnum mt-1.5 text-[11.5px] text-faint">
                {fmtMoney(earnedNative, account.currency)} as it landed
              </div>
            ) : (
              <div className="mt-1.5 text-[11.5px] text-faint">Earned this period</div>
            )}
          </>
        ) : (
          <>
            <div className="text-[19px] font-medium leading-none tracking-[-0.02em] text-faint">
              Nothing this period
            </div>
            <div className="mt-1.5 text-[11.5px] text-faint">
              {last ? `Last movement ${fmtDate(last.date, "long")}` : "No movement on record"}
            </div>
          </>
        )}
      </div>

      <div className="mt-4">
        <TickStrip
          values={perMonth}
          keys={keys}
          fill={hue}
          dimmed={dimmed}
          settleKey={settleKey}
        />
        <div className="mt-1.5 flex justify-between text-[9.5px] tracking-[0.06em] text-faint">
          <span>{monthLabel(keys[0])}</span>
          <span>{monthLabel(keys[keys.length - 1])}</span>
        </div>
      </div>

      {/* Fixed-fee work is measured against its contract; a retainer has no
          contract to run out, so it is measured on whether it kept arriving. */}
      <div className="mt-auto pt-4">
        <div className="mb-3">
          <div className="flex items-baseline justify-between gap-3 text-[11.5px]">
            <span className="shrink-0 text-faint">
              {progress !== null ? "Against contract" : "Months paid"}
            </span>
            <span className="tnum truncate text-muted">
              {progress !== null ? (
                <>
                  {fmtShort(allTime, account.currency)} of{" "}
                  {fmtShort(account.contracted!, account.currency)}
                  <span className="ml-1.5 text-faint">{Math.round(progress * 100)}%</span>
                </>
              ) : (
                <>
                  {monthsPaid} of {keys.length}
                  <span className="ml-1.5 text-faint">
                    {interiorGaps === 0
                      ? "unbroken"
                      : `${interiorGaps} missed`}
                  </span>
                </>
              )}
            </span>
          </div>
          <div className="mt-1.5 h-[3px] w-full rounded-full bg-rule">
            <div
              className="sweep h-full rounded-full"
              style={{
                width: `${Math.max((progress ?? monthsPaid / keys.length) * 100, 1.5)}%`,
                background: hue,
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-rule-soft pt-3">
          <div className="min-w-0">
            <StatusLabel status={account.status} />
            <div className="tnum mt-1 truncate text-[11.5px] text-faint">{account.engagement}</div>
          </div>
          <span className="text-faint transition-colors group-hover:text-mint">
            <IconArrow size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}


/**
 * You, as one more account. Same footprint, same internal order, same grid cell
 * as every client — the board's whole claim is that these are peers, and a wide
 * summary panel underneath the grid would have been the arrangement it refuses.
 * The full category breakdown lives on the account's own page.
 */
export function SelfCard({
  account,
  entries,
  keys,
  display,
  focus,
  setFocus,
  settleKey,
  index,
}: {
  account: Account;
  entries: Entry[];
  keys: string[];
  display: CurrencyCode;
  focus: string | null;
  setFocus: (id: string | null) => void;
  settleKey: number;
  index: number;
}) {
  const { rate } = useDisplayCurrency();
  const spent = entries.reduce(
    (t, e) => t + Math.abs(convert(e.amount, e.currency, display, rate)),
    0,
  );
  const perMonth = keys.map((k) =>
    entries
      .filter((e) => e.date.startsWith(k))
      .reduce((t, e) => t + Math.abs(convert(e.amount, e.currency, display, rate)), 0),
  );

  const byCategory = new Map<string, number>();
  for (const e of entries) {
    const c = e.category ?? "Other";
    byCategory.set(c, (byCategory.get(c) ?? 0) + Math.abs(convert(e.amount, e.currency, display, rate)));
  }
  const categories = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
  const bands = categories.slice(0, 5);
  const rest = categories.slice(5).reduce((t, [, v]) => t + v, 0);
  if (rest > 0) bands.push([`${categories.length - 5} more`, rest]);

  const dimmed = focus !== null && focus !== SELF_ACCOUNT_ID;
  const months = Math.max(1, keys.length);

  return (
    <Link
      href={`/projects/${SELF_ACCOUNT_ID}`}
      onMouseEnter={() => setFocus(SELF_ACCOUNT_ID)}
      onMouseLeave={() => setFocus(null)}
      onFocus={() => setFocus(SELF_ACCOUNT_ID)}
      onBlur={() => setFocus(null)}
      style={{ animationDelay: `${index * 45}ms` }}
      className={[
        "settle group plate relative flex flex-col p-4 transition-[opacity,border-color,background-color] duration-200",
        "hover:border-rose-deep hover:bg-plate-2 focus-visible:border-rose-deep",
        dimmed ? "opacity-45" : "opacity-100",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold tracking-[-0.01em] text-ink">
            {account.client}
          </div>
          <div className="mt-0.5 truncate text-[12px] text-muted">
            Everything that leaves · {account.place}
          </div>
        </div>
        <Chip tone="rose">OUT</Chip>
      </div>

      <div className="mt-4">
        <div
          key={`self-${settleKey}`}
          className="tnum text-[26px] font-semibold leading-none tracking-[-0.025em] text-rose"
        >
          {fmtMoney(spent, display)}
        </div>
        <div className="tnum mt-1.5 text-[11.5px] text-faint">
          {fmtMoney(spent / months, display)} a month across {months} months
        </div>
      </div>

      <div className="mt-4">
        <TickStrip
          values={perMonth}
          keys={keys}
          fill="var(--color-rose)"
          dimmed={dimmed}
          settleKey={settleKey}
        />
        <div className="mt-1.5 flex justify-between text-[9.5px] tracking-[0.06em] text-faint">
          <span>{monthLabel(keys[0])}</span>
          <span>{monthLabel(keys[keys.length - 1])}</span>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <div className="mb-3">
          <div className="flex items-baseline justify-between gap-3 text-[11.5px]">
            <span className="shrink-0 text-faint">Where it went</span>
            <span className="tnum truncate text-muted">
              {categories[0]?.[0] ?? "Nothing yet"}
              {categories[0] ? (
                <span className="ml-1.5 text-faint">
                  leads at {fmtShort(categories[0][1], display)}
                </span>
              ) : null}
            </span>
          </div>
          <div className="mt-1.5 flex h-[6px] w-full overflow-hidden rounded-full bg-rule">
            {bands.map(([name, value], i) => (
              <span
                key={name}
                className="sweep h-full shrink-0"
                title={`${name} · ${fmtShort(value, display)}`}
                style={{
                  width: `${(value / Math.max(spent, 1)) * 100}%`,
                  background: catFill(i),
                  boxShadow: i === 0 ? undefined : "inset 1px 0 0 var(--color-plate)",
                  animationDelay: `${i * 45}ms`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-rule-soft pt-3">
          <div className="min-w-0">
            <StatusLabel status={account.status} />
            <div className="tnum mt-1 truncate text-[11.5px] text-faint">
              {categories.length} categories · {entries.length} movements
            </div>
          </div>
          <span className="text-faint transition-colors group-hover:text-rose">
            <IconArrow size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
