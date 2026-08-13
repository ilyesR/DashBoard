"use client";

import Link from "next/link";
import { ACCOUNTS, ENTRIES, SELF_ACCOUNT_ID, UNATTRIBUTED } from "@/lib/data";
import { convert, fmtMoney, fmtShort, HUE_VAR } from "@/lib/money";
import { useDisplayCurrency } from "@/components/currency-context";

/** Which client actually carries the year, on one divided rule. */
export function EarnedSplit() {
  const { display, rate } = useDisplayCurrency();

  const rows = ACCOUNTS.filter((a) => a.id !== SELF_ACCOUNT_ID)
    .map((a) => ({
      account: a,
      value: ENTRIES.filter((e) => e.accountId === a.id && e.amount > 0).reduce(
        (t, e) => t + convert(e.amount, e.currency, display, rate),
        0,
      ),
    }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = rows.reduce((t, r) => t + r.value, 0);
  const spent = ENTRIES.filter((e) => e.amount < 0).reduce(
    (t, e) => t + Math.abs(convert(e.amount, e.currency, display, rate)),
    0,
  );

  return (
    // Side by side while it sits under the table; stacked once it is a rail.
    <aside className="grid gap-5 md:grid-cols-2 min-[1660px]:grid-cols-1">
      <section className="plate p-4">
        <div className="eyeline">Earned by client · {display}</div>
        <div className="tnum mt-2.5 text-[24px] font-semibold leading-none tracking-[-0.025em] text-ink">
          {fmtMoney(total, display)}
        </div>

        <div className="mt-4 flex h-[8px] w-full overflow-hidden rounded-full bg-rule">
          {rows.map((r, i) => (
            <span
              key={r.account.id}
              className="sweep h-full shrink-0"
              title={`${r.account.client} · ${fmtShort(r.value, display)}`}
              style={{
                width: `${(r.value / Math.max(total, 1)) * 100}%`,
                background: HUE_VAR[r.account.hue],
                boxShadow: i === 0 ? undefined : "inset 1px 0 0 var(--color-plate)",
                animationDelay: `${i * 45}ms`,
              }}
            />
          ))}
        </div>

        <ul className="mt-4 flex flex-col gap-2.5">
          {rows.map((r) => (
            <li key={r.account.id} className="flex items-baseline gap-2.5">
              <span
                className="size-[7px] shrink-0 rounded-[2px]"
                style={{ background: HUE_VAR[r.account.hue] }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate text-[12px] text-muted">
                {r.account.client}
              </span>
              <span className="tnum shrink-0 text-[11.5px] text-faint">
                {Math.round((r.value / Math.max(total, 1)) * 100)}%
              </span>
              <span className="tnum w-[58px] shrink-0 text-right text-[12px] text-ink">
                {fmtShort(r.value, display)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="plate p-4">
        <div className="eyeline">Against your own spending</div>
        <p className="mt-2.5 text-[12.5px] leading-[1.6] text-muted">
          The work brought in{" "}
          <span className="tnum text-mint">{fmtMoney(total, display)}</span> while{" "}
          <span className="tnum text-rose">{fmtMoney(spent, display)}</span> left. Everything
          attributed so far traces back to a project on this page.
        </p>
        {UNATTRIBUTED.length > 0 ? (
          <p className="mt-2.5 text-[12.5px] leading-[1.6] text-amber">
            <Link href="/transactions/unattributed" className="underline underline-offset-[3px]">
              {UNATTRIBUTED.length}{" "}
              {UNATTRIBUTED.length === 1 ? "movement" : "movements"}
            </Link>{" "}
            {UNATTRIBUTED.length === 1 ? "has" : "have"} not been attributed to anything yet, and{" "}
            {UNATTRIBUTED.length === 1 ? "is" : "are"} counted in neither figure.
          </p>
        ) : null}
        <p className="tnum mt-3 border-t border-rule-soft pt-3 text-[11.5px] text-faint">
          {rows.length > 0
            ? `${rows[0].account.client} carries ${Math.round(
                (rows[0].value / Math.max(total, 1)) * 100,
              )}% of it`
            : "No income on record"}
        </p>
      </section>
    </aside>
  );
}
