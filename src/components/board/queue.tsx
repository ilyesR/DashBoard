"use client";

import { useState } from "react";
import { ACCOUNTS, SELF_ACCOUNT_ID, UNATTRIBUTED } from "@/lib/data";
import { convert, fmtDate, fmtMoney } from "@/lib/money";
import type { CurrencyCode, Entry } from "@/lib/types";
import { IconCheck, IconChevronDown } from "@/components/icons";
import { useDisplayCurrency } from "@/components/currency-context";
import { Chip } from "@/components/ui";

type Resolved = { entry: Entry; accountId: string };

/**
 * A transaction that arrived from the bank with nobody to belong to gets no plate.
 * Every account on the board is a closed plate; these are drawn as an unclosed
 * frame — a rule down the left and along the bottom, open at the top and right —
 * sitting directly on the ground. Attributing one is what closes it.
 */
export function Queue({ display, wide = false }: { display: CurrencyCode; wide?: boolean }) {
  const { rate } = useDisplayCurrency();
  const [items, setItems] = useState<Entry[]>(UNATTRIBUTED);
  const [resolved, setResolved] = useState<Resolved[]>([]);

  function assign(entry: Entry, accountId: string) {
    setItems((prev) => prev.filter((e) => e.id !== entry.id));
    setResolved((prev) => [{ entry, accountId }, ...prev]);
  }

  function undo(entryId: string) {
    const hit = resolved.find((r) => r.entry.id === entryId);
    if (!hit) return;
    setResolved((prev) => prev.filter((r) => r.entry.id !== entryId));
    setItems((prev) =>
      [...prev, hit.entry].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    );
  }

  return (
    <section aria-labelledby="queue-heading">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="queue-heading" className="text-[13.5px] font-semibold tracking-[-0.01em]">
          No home yet
        </h2>
        {items.length > 0 ? (
          <span className="tnum rounded-full bg-amber-deep px-1.5 py-px text-[11px] font-medium text-amber">
            {items.length}
          </span>
        ) : null}
      </div>
      <p className="mt-1 max-w-[54ch] text-[11.5px] leading-[1.5] text-faint">
        Synced from the bank without a reference. Attribute each one and it leaves this list.
      </p>

      {items.length === 0 ? (
        <div className="mt-4 border-b border-l border-rule py-8 pl-4 pr-4">
          <span className="text-mint">
            <IconCheck size={22} />
          </span>
          <p className="mt-2.5 text-[13px] font-medium text-ink">The queue is clear</p>
          <p className="mt-1 max-w-[42ch] text-[11.5px] leading-[1.5] text-faint">
            Every synced transaction belongs to an account. New ones land here.
          </p>
        </div>
      ) : (
        <ul
          className={
            wide
              ? "mt-4 grid gap-x-6 gap-y-6 sm:grid-cols-2 min-[1400px]:grid-cols-3"
              : "mt-4 flex flex-col gap-5"
          }
        >
          {items.map((entry) => (
            <li key={entry.id} className="settle border-b border-l border-rule pb-3.5 pl-3">
              {/* The bank's own figure leads, because triage means matching this
                  against a statement. The converted figure follows it. */}
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={`tnum text-[16.5px] font-semibold tracking-[-0.02em] ${
                    entry.amount > 0 ? "text-mint" : "text-rose"
                  }`}
                >
                  {fmtMoney(entry.amount, entry.currency, {
                    cents: Math.abs(entry.amount) < 1000,
                    sign: true,
                  })}
                </span>
                <Chip>{entry.currency}</Chip>
              </div>
              {entry.currency !== display ? (
                <div className="tnum mt-1 text-[11px] text-faint">
                  ≈{" "}
                  {fmtMoney(convert(entry.amount, entry.currency, display, rate), display, {
                    cents: Math.abs(entry.amount) < 1000,
                  })}{" "}
                  in {display}
                </div>
              ) : null}

              <div className="mt-2 font-mono text-[11px] leading-[1.5] tracking-[-0.01em] text-muted">
                {entry.counterparty}
              </div>
              <div className="mt-0.5 font-mono text-[10.5px] leading-[1.5] tracking-[-0.01em] text-faint">
                {entry.memo}
              </div>
              <div className="mt-1.5 text-[11px] text-faint">{fmtDate(entry.date, "long")}</div>

              <div className="relative mt-3">
                <select
                  aria-label={`Attribute ${entry.counterparty} to an account`}
                  defaultValue=""
                  onChange={(e) => e.target.value && assign(entry, e.target.value)}
                  className="w-full appearance-none rounded-lg border border-rule bg-plate py-1.5 pl-2.5 pr-8 text-[12px] text-muted transition-colors hover:border-plate-3 hover:text-ink"
                >
                  <option value="" disabled>
                    Attribute to…
                  </option>
                  {ACCOUNTS.filter((a) => a.status !== "closed" || a.id === SELF_ACCOUNT_ID).map(
                    (a) => (
                      <option key={a.id} value={a.id}>
                        {a.id === SELF_ACCOUNT_ID ? "Personal — everything that leaves" : a.client}
                      </option>
                    ),
                  )}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-faint">
                  <IconChevronDown size={15} />
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {resolved.length > 0 ? (
        <div className="mt-5 border-t border-rule-soft pt-3">
          <div className="eyeline mb-2">Attributed just now</div>
          <ul className="flex flex-col gap-1.5">
            {resolved.map(({ entry, accountId }) => {
              const account = ACCOUNTS.find((a) => a.id === accountId);
              return (
                <li key={entry.id} className="flex items-center gap-2 text-[11.5px]">
                  <span className="text-mint">
                    <IconCheck size={14} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-muted">
                    {fmtMoney(convert(entry.amount, entry.currency, display, rate), display, {
                      cents: Math.abs(entry.amount) < 1000,
                      sign: true,
                    })}{" "}
                    → {account?.id === SELF_ACCOUNT_ID ? "Personal" : account?.client}
                  </span>
                  <button
                    type="button"
                    onClick={() => undo(entry.id)}
                    className="shrink-0 rounded px-1 text-faint underline decoration-rule underline-offset-[3px] transition-colors hover:text-ink hover:decoration-faint"
                  >
                    Undo
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
