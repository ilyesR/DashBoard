"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ACCOUNTS, SELF_ACCOUNT_ID } from "@/lib/data";
import { convert, fmtDate, fmtMoney } from "@/lib/money";
import type { CurrencyCode, Entry } from "@/lib/types";
import { useDisplayCurrency } from "@/components/currency-context";
import { IconChevronDown, IconHand, IconSearch, IconSync } from "@/components/icons";
import { Segmented } from "@/components/ui";

export type Flow = "all" | "in" | "out";

function accountLabel(id: string | null): string {
  if (!id) return "No home yet";
  const a = ACCOUNTS.find((x) => x.id === id);
  if (!a) return "Unknown";
  return a.id === SELF_ACCOUNT_ID ? "Personal" : a.client;
}

/**
 * The ledger. One row per movement, the amount as it landed on the left of the
 * amount as displayed, so a converted figure never stands alone.
 */
export function Ledger({
  entries,
  initialFlow = "all",
  showAccount = true,
  showFilters = true,
}: {
  entries: Entry[];
  initialFlow?: Flow;
  showAccount?: boolean;
  showFilters?: boolean;
}) {
  const { display, rate } = useDisplayCurrency();
  const [flow, setFlow] = useState<Flow>(initialFlow);
  const [accountId, setAccountId] = useState("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return entries
      .filter((e) => (flow === "all" ? true : flow === "in" ? e.amount > 0 : e.amount < 0))
      .filter((e) => (accountId === "all" ? true : e.accountId === accountId))
      .filter(
        (e) =>
          !needle ||
          `${e.counterparty} ${e.memo} ${e.category ?? ""} ${accountLabel(e.accountId)}`
            .toLowerCase()
            .includes(needle),
      )
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [entries, flow, accountId, query]);

  const totalIn = rows
    .filter((e) => e.amount > 0)
    .reduce((t, e) => t + convert(e.amount, e.currency, display, rate), 0);
  const totalOut = rows
    .filter((e) => e.amount < 0)
    .reduce((t, e) => t + Math.abs(convert(e.amount, e.currency, display, rate)), 0);

  return (
    <section className="plate overflow-hidden">
      {showFilters ? (
        <div className="flex flex-wrap items-center gap-2.5 border-b border-rule-soft px-4 py-3 sm:px-5">
          <Segmented
            label="Direction"
            size="sm"
            value={flow}
            options={[
              { value: "all" as Flow, label: "All" },
              { value: "in" as Flow, label: "In" },
              { value: "out" as Flow, label: "Out" },
            ]}
            onChange={setFlow}
          />
          <div className="relative">
            <select
              aria-label="Account"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="appearance-none rounded-lg border border-rule bg-plate py-[5px] pl-2.5 pr-8 text-[12.5px] text-muted transition-colors hover:border-plate-3 hover:text-ink"
            >
              <option value="all">Every account</option>
              {ACCOUNTS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id === SELF_ACCOUNT_ID ? "Personal" : a.client}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-faint">
              <IconChevronDown size={15} />
            </span>
          </div>
          <div className="relative ml-auto">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint">
              <IconSearch size={15} />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the ledger"
              aria-label="Search the ledger"
              className="w-[168px] rounded-lg border border-rule bg-plate py-[5px] pl-8 pr-2.5 text-[12.5px] transition-colors hover:border-plate-3 focus:w-[220px] focus:border-mint-4"
            />
          </div>
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <p className="text-[14px] font-medium text-ink">Nothing matches these filters</p>
          <p className="mt-1.5 max-w-[38ch] text-[12.5px] leading-[1.55] text-faint">
            Widen the direction, choose another account, or clear the search to see the whole ledger
            again.
          </p>
          <button
            type="button"
            onClick={() => {
              setFlow("all");
              setAccountId("all");
              setQuery("");
            }}
            className="mt-4 rounded-lg border border-rule bg-plate px-3 py-1.5 text-[12.5px] text-muted transition-colors hover:border-plate-3 hover:text-ink"
          >
            Reset the filters
          </button>
        </div>
      ) : (
        <>
        {/* Below the table's honest minimum width the money columns fall off the
            viewport, which is the one thing this screen exists to show. Under
            that width the same rows are stacked instead of scrolled. */}
        <ul className="flex flex-col md:hidden">
          {rows.map((e) => {
            const converted = convert(e.amount, e.currency, display, rate);
            const inbound = e.amount > 0;
            return (
              <li key={e.id} className="border-b border-rule-soft px-4 py-3 last:border-0">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-[13px] text-ink">{e.counterparty}</span>
                  <span
                    className={`tnum shrink-0 text-[13px] font-medium ${
                      inbound ? "text-mint" : "text-rose"
                    }`}
                  >
                    {fmtMoney(converted, display, {
                      cents: Math.abs(converted) < 1000,
                      sign: true,
                    })}
                  </span>
                </div>
                <div className="mt-0.5 flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate font-mono text-[10.5px] tracking-[-0.01em] text-faint">
                    {e.memo}
                  </span>
                  {e.currency !== display ? (
                    <span className="tnum shrink-0 text-[11px] text-faint">
                      {fmtMoney(e.amount, e.currency, {
                        cents: Math.abs(e.amount) < 1000,
                        sign: true,
                      })}
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-faint">
                  <span className="tnum">{fmtDate(e.date)}</span>
                  <span aria-hidden="true">·</span>
                  {e.accountId ? (
                    <Link
                      href={
                        e.accountId === SELF_ACCOUNT_ID
                          ? "/transactions?flow=out"
                          : `/projects/${e.accountId}`
                      }
                      className="text-muted underline decoration-rule underline-offset-[3px]"
                    >
                      {accountLabel(e.accountId)}
                    </Link>
                  ) : (
                    <span className="text-amber">No home yet</span>
                  )}
                  {e.category ? <span>· {e.category}</span> : null}
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    {e.source === "sync" ? <IconSync size={12} /> : <IconHand size={12} />}
                    {e.source === "sync" ? "Synced" : "By hand"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-rule-soft">
                <th scope="col" className="eyeline px-4 py-2.5 font-medium sm:px-5">
                  Date
                </th>
                <th scope="col" className="eyeline px-3 py-2.5 font-medium">
                  Counterparty
                </th>
                {showAccount ? (
                  <th scope="col" className="eyeline px-3 py-2.5 font-medium">
                    Account
                  </th>
                ) : null}
                <th scope="col" className="eyeline px-3 py-2.5 font-medium">
                  Source
                </th>
                <th scope="col" className="eyeline px-3 py-2.5 text-right font-medium">
                  As landed
                </th>
                <th scope="col" className="eyeline px-4 py-2.5 text-right font-medium sm:px-5">
                  In {display}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => {
                const converted = convert(e.amount, e.currency, display, rate);
                const inbound = e.amount > 0;
                return (
                  <tr
                    key={e.id}
                    className="border-b border-rule-soft last:border-0 transition-colors hover:bg-plate-2"
                  >
                    <td className="tnum whitespace-nowrap px-4 py-2.5 text-[12px] text-faint sm:px-5">
                      {fmtDate(e.date)}
                    </td>
                    <td className="max-w-[280px] px-3 py-2.5">
                      <div className="truncate text-[12.5px] text-ink">{e.counterparty}</div>
                      <div className="truncate font-mono text-[10.5px] tracking-[-0.01em] text-faint">
                        {e.memo}
                      </div>
                    </td>
                    {showAccount ? (
                      <td className="px-3 py-2.5 text-[12px]">
                        {e.accountId ? (
                          <Link
                            href={
                              e.accountId === SELF_ACCOUNT_ID
                                ? "/transactions?flow=out"
                                : `/projects/${e.accountId}`
                            }
                            className="text-muted underline decoration-rule underline-offset-[3px] transition-colors hover:text-ink hover:decoration-faint"
                          >
                            {accountLabel(e.accountId)}
                          </Link>
                        ) : (
                          <span className="text-amber">No home yet</span>
                        )}
                        {e.category ? (
                          <span className="ml-1.5 text-faint">· {e.category}</span>
                        ) : null}
                      </td>
                    ) : null}
                    <td className="px-3 py-2.5">
                      <span
                        className="inline-flex items-center gap-1.5 text-[11.5px] text-faint"
                        title={e.source === "sync" ? "Synced from the bank" : "Entered by hand"}
                      >
                        {e.source === "sync" ? <IconSync size={13} /> : <IconHand size={13} />}
                        {e.source === "sync" ? "Synced" : "By hand"}
                      </span>
                    </td>
                    <td className="tnum whitespace-nowrap px-3 py-2.5 text-right text-[12px] text-faint">
                      {e.currency === display
                        ? "—"
                        : fmtMoney(e.amount, e.currency, { cents: Math.abs(e.amount) < 1000, sign: true })}
                    </td>
                    <td
                      className={`tnum whitespace-nowrap px-4 py-2.5 text-right text-[12.5px] font-medium sm:px-5 ${
                        inbound ? "text-mint" : "text-rose"
                      }`}
                    >
                      {fmtMoney(converted, display, {
                        cents: Math.abs(converted) < 1000,
                        sign: true,
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </>
      )}

      <div className="hair-t flex flex-wrap items-center gap-x-6 gap-y-1.5 px-4 py-3 text-[12px] sm:px-5">
        <span className="text-faint">
          <span className="tnum text-muted">{rows.length}</span>{" "}
          {rows.length === 1 ? "movement" : "movements"}
        </span>
        <span className="text-faint">
          In <span className="tnum text-mint">{fmtMoney(totalIn, display)}</span>
        </span>
        <span className="text-faint">
          Out <span className={`tnum ${totalOut > 0 ? "text-rose" : "text-faint"}`}>{fmtMoney(totalOut, display)}</span>
        </span>
        <span className="text-faint">
          Net{" "}
          <span className="tnum text-ink">{fmtMoney(totalIn - totalOut, display)}</span>
        </span>
      </div>
    </section>
  );
}

export function CurrencySwitch() {
  const { display, setDisplay } = useDisplayCurrency();
  return (
    <Segmented
      label="Display currency"
      size="sm"
      value={display}
      options={[
        { value: "EUR" as CurrencyCode, label: "EUR" },
        { value: "AED" as CurrencyCode, label: "AED" },
      ]}
      onChange={setDisplay}
    />
  );
}
