"use client";

import Link from "next/link";
import { AS_OF, ENTRIES, SELF_ACCOUNT_ID } from "@/lib/data";
import { convert, fmtDate, fmtMoney, fmtShort, HUE_VAR, monthLabel } from "@/lib/money";
import type { Account } from "@/lib/types";
import { useDisplayCurrency } from "@/components/currency-context";
import { IconArrow } from "@/components/icons";
import { Ledger } from "@/components/ledger/ledger";
import { Chip, StatusLabel } from "@/components/ui";

const CHART_H = 104;

export function ProjectDetail({ account }: { account: Account }) {
  const { display, rate } = useDisplayCurrency();
  const isSelf = account.id === SELF_ACCOUNT_ID;
  const entries = ENTRIES.filter((e) => e.accountId === account.id);

  const total = entries.reduce(
    (t, e) => t + Math.abs(convert(e.amount, e.currency, display, rate)),
    0,
  );
  const native = entries.reduce(
    (t, e) => t + Math.abs(convert(e.amount, e.currency, account.currency, rate)),
    0,
  );

  // A continuous run of months from the first movement to today. Showing only
  // the months that had money hides the cadence, which is the whole point here.
  const keys = (() => {
    const stamps = entries.map((e) => e.date.slice(0, 7)).sort();
    if (stamps.length === 0) return [];
    const out: string[] = [];
    const cursor = new Date(`${stamps[0]}-01T00:00:00Z`);
    const end = new Date(`${AS_OF.slice(0, 7)}-01T00:00:00Z`);
    while (cursor <= end) {
      out.push(cursor.toISOString().slice(0, 7));
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }
    return out;
  })();
  const values = keys.map((k) =>
    entries
      .filter((e) => e.date.startsWith(k))
      .reduce((t, e) => t + Math.abs(convert(e.amount, e.currency, display, rate)), 0),
  );
  const peak = Math.max(1, ...values);

  const byCategory = new Map<string, number>();
  if (isSelf) {
    for (const e of entries) {
      const c = e.category ?? "Other";
      byCategory.set(
        c,
        (byCategory.get(c) ?? 0) + Math.abs(convert(e.amount, e.currency, display, rate)),
      );
    }
  }
  const categories = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);

  const progress = account.contracted ? Math.min(1, native / account.contracted) : null;
  const hue = isSelf ? "var(--color-rose)" : HUE_VAR[account.hue];
  const last = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-5 xl:p-7">
      <section className="plate flex flex-col gap-6 p-4 sm:p-5 lg:flex-row lg:gap-9">
        <div className="lg:w-[300px] lg:shrink-0">
          <div className="flex items-center gap-2.5">
            <StatusLabel status={account.status} />
            <Chip tone={isSelf ? "rose" : "neutral"}>{account.currency}</Chip>
          </div>

          <div className="tnum mt-4 text-[34px] font-semibold leading-none tracking-[-0.03em]" style={{ color: isSelf ? "var(--color-rose)" : "var(--color-ink)" }}>
            {fmtMoney(total, display)}
          </div>
          <p className="mt-2 text-[12px] text-faint">
            {isSelf ? "Spent" : "Earned"} on record
            {account.currency !== display ? (
              <>
                {" · "}
                <span className="tnum">{fmtMoney(native, account.currency)}</span> as it landed
              </>
            ) : null}
          </p>

          <dl className="mt-5 flex flex-col gap-3 border-t border-rule-soft pt-4 text-[12.5px]">
            <div className="flex justify-between gap-4">
              <dt className="text-faint">Deal</dt>
              <dd className="tnum text-right text-muted">{account.engagement}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-faint">Started</dt>
              <dd className="tnum text-muted">{fmtDate(account.startedOn, "long")}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-faint">Last movement</dt>
              <dd className="tnum text-muted">
                {last ? fmtDate(last.date, "long") : "None on record"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-faint">Movements</dt>
              <dd className="tnum text-muted">{entries.length}</dd>
            </div>
          </dl>

          {progress !== null ? (
            <div className="mt-4 border-t border-rule-soft pt-4">
              <div className="flex items-baseline justify-between text-[12px]">
                <span className="text-faint">Against contract</span>
                <span className="tnum text-muted">
                  {fmtShort(native, account.currency)} of{" "}
                  {fmtShort(account.contracted!, account.currency)}
                </span>
              </div>
              <div className="mt-2 h-[4px] w-full overflow-hidden rounded-full bg-rule">
                <div
                  className="sweep h-full rounded-full"
                  style={{ width: `${Math.max(progress * 100, 1.5)}%`, background: hue }}
                />
              </div>
              <p className="tnum mt-2 text-[11.5px] text-faint">
                {Math.round(progress * 100)}% of the contract landed
                {progress < 1 ? (
                  <>
                    {" · "}
                    {fmtShort(account.contracted! - native, account.currency)} still to come
                  </>
                ) : (
                  " · nothing left to come"
                )}
              </p>
            </div>
          ) : null}

          {account.note ? (
            <p className="mt-4 border-t border-rule-soft pt-4 text-[12.5px] leading-[1.6] text-muted">
              {account.note}
            </p>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 border-t border-rule-soft pt-5 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
          <div className="eyeline">Month by month · {display}</div>
          {keys.length === 0 ? (
            <p className="mt-6 text-[13px] text-faint">
              Nothing has moved through this account yet.
            </p>
          ) : (
            <>
            <div className="mt-5 flex items-end gap-2.5 overflow-x-auto pb-1 sm:gap-3.5">
              {keys.map((k, i) => (
                <div
                  key={k}
                  className="group flex w-[46px] shrink-0 flex-col items-center sm:w-[58px]"
                >
                  <span className="tnum mb-1.5 h-[13px] text-[10.5px] text-faint transition-colors group-hover:text-muted">
                    {values[i] > 0 ? fmtShort(values[i], display) : ""}
                  </span>
                  <span
                    className="flex w-full items-end border-b border-rule"
                    style={{ height: CHART_H }}
                  >
                    <span
                      className="rise w-full rounded-t-[3px] transition-opacity duration-200 group-hover:opacity-80"
                      style={{
                        height: values[i] > 0 ? Math.max(5, (values[i] / peak) * CHART_H) : 3,
                        background: values[i] > 0 ? hue : "var(--color-rule)",
                        animationDelay: `${i * 45}ms`,
                      }}
                    />
                  </span>
                  <span className="mt-2 text-[10.5px] tracking-[0.06em] text-faint">
                    {monthLabel(k)}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11.5px] text-faint">
              {keys.length} months since the first movement · {values.filter((v) => v > 0).length}{" "}
              with money in them
            </p>

            {isSelf && categories.length > 0 ? (
              <div className="mt-6 border-t border-rule-soft pt-5">
                <div className="eyeline mb-3">Where it went</div>
                <div
                  className="sweep flex h-[26px] w-full overflow-hidden rounded-[4px]"
                  aria-hidden="true"
                >
                  {categories.map(([name, value], i) => (
                    <span
                      key={name}
                      className="h-full shrink-0"
                      title={`${name} · ${fmtShort(value, display)}`}
                      style={{
                        width: `${(value / Math.max(total, 1)) * 100}%`,
                        background: `color-mix(in oklab, var(--color-rose) ${Math.max(
                          100 - i * 9,
                          20,
                        )}%, transparent)`,
                        boxShadow: i === 0 ? undefined : "inset 1px 0 0 var(--color-plate)",
                      }}
                    />
                  ))}
                </div>
                <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 xl:grid-cols-3">
                  {categories.map(([name, value], i) => (
                    <li key={name} className="flex items-baseline gap-2">
                      <span
                        className="size-[7px] shrink-0 rounded-[2px]"
                        style={{
                          background: `color-mix(in oklab, var(--color-rose) ${Math.max(
                            100 - i * 9,
                            20,
                          )}%, transparent)`,
                        }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1 truncate text-[12px] text-muted">{name}</span>
                      <span className="tnum shrink-0 text-[11.5px] text-faint">
                        {fmtShort(value, display)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            </>
          )}
        </div>
      </section>

      <Ledger entries={entries} showAccount={isSelf} showFilters={entries.length > 8} />

      <Link
        href="/"
        className="flex items-center gap-1.5 self-start text-[12.5px] text-faint transition-colors hover:text-mint"
      >
        Back to the board
        <IconArrow size={15} />
      </Link>
    </div>
  );
}
