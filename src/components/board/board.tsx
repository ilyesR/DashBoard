"use client";

import { useMemo, useState } from "react";
import { ACCOUNTS, AS_OF, ENTRIES, SELF_ACCOUNT_ID } from "@/lib/data";
import { fmtDate, inPeriod, monthKeys, type PeriodKey } from "@/lib/money";
import type { Entry } from "@/lib/types";
import { useDisplayCurrency } from "@/components/currency-context";
import { IconPlus, IconSearch } from "@/components/icons";
import { PageHeader } from "@/components/ui";
import { AccountCard, SelfCard } from "./account-card";
import { FlowBar } from "./flow-bar";
import { QuickEntry, QuickEntryTrigger } from "./quick-entry";
import { Queue } from "./queue";

export function Board() {
  const { display, setDisplay, settleKey } = useDisplayCurrency();
  const [period, setPeriod] = useState<PeriodKey>("6m");
  const [focus, setFocus] = useState<string | null>(null);
  const [added, setAdded] = useState<Entry[]>([]);
  const [query, setQuery] = useState("");
  const [entryOpen, setEntryOpen] = useState(false);

  const allEntries = useMemo(() => [...ENTRIES, ...added], [added]);
  const keys = useMemo(() => monthKeys(period), [period]);
  const scoped = useMemo(
    () => allEntries.filter((e) => inPeriod(e, period)),
    [allEntries, period],
  );

  const self = ACCOUNTS.find((a) => a.id === SELF_ACCOUNT_ID)!;
  const needle = query.trim().toLowerCase();
  const projects = ACCOUNTS.filter((a) => a.id !== SELF_ACCOUNT_ID).filter(
    (a) =>
      !needle ||
      `${a.client} ${a.name} ${a.place} ${a.status}`.toLowerCase().includes(needle),
  );

  return (
    <>
      <PageHeader
        title="Board"
        meta={
          <>
            {ACCOUNTS.length} accounts · demo ledger to {fmtDate(AS_OF, "long")}
          </>
        }
      >
        <div className="relative hidden sm:block">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint">
            <IconSearch size={15} />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter accounts"
            aria-label="Filter accounts"
            className="w-[172px] rounded-lg border border-rule bg-plate py-[6px] pl-8 pr-2.5 text-[12.5px] transition-colors hover:border-plate-3 focus:w-[212px] focus:border-mint-4"
          />
        </div>
        <QuickEntryTrigger open={entryOpen} onOpen={() => setEntryOpen(true)} />
      </PageHeader>

      <div className="flex flex-col gap-5 p-4 sm:p-5 xl:p-7">
        {entryOpen ? (
          <QuickEntry
            onAdd={(entry) => setAdded((prev) => [...prev, entry])}
            onClose={() => setEntryOpen(false)}
          />
        ) : null}

        <FlowBar
          entries={allEntries}
          display={display}
          setDisplay={setDisplay}
          period={period}
          setPeriod={setPeriod}
          focus={focus}
          setFocus={setFocus}
          settleKey={settleKey}
        />

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_324px]">
          <div className="flex min-w-0 flex-col gap-5">
            {projects.length > 0 ? (
              <div className="grid min-w-0 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {projects.map((account, i) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    entries={scoped.filter((e) => e.accountId === account.id)}
                    allEntries={allEntries}
                    keys={keys}
                    display={display}
                    focus={focus}
                    setFocus={setFocus}
                    settleKey={settleKey}
                    index={i}
                  />
                ))}
                {/* You, in the same grid, at the same size as the clients. */}
                <SelfCard
                  account={self}
                  entries={scoped.filter((e) => e.accountId === SELF_ACCOUNT_ID)}
                  keys={keys}
                  display={display}
                  focus={focus}
                  setFocus={setFocus}
                  settleKey={settleKey}
                  index={projects.length}
                />

                {/* Not an account, so it gets the queue's unclosed frame rather
                    than a plate — and it fills the cell an odd number of
                    accounts would otherwise leave hanging. */}
                <button
                  type="button"
                  onClick={() => setEntryOpen(true)}
                  className="settle flex flex-col items-start justify-end gap-2.5 rounded-[14px] border-b border-l border-rule p-4 text-left transition-colors hover:border-mint-4"
                  style={{ animationDelay: `${(projects.length + 1) * 45}ms` }}
                >
                  <span className="text-faint">
                    <IconPlus size={19} />
                  </span>
                  <span className="text-[13.5px] font-medium text-muted">Log an entry</span>
                  <span className="max-w-[34ch] text-[11.5px] leading-[1.5] text-faint">
                    Cash, a foreign account, a correction — anything no bank will send you.
                  </span>
                </button>
              </div>
            ) : (
              <div className="plate flex flex-col items-center px-6 py-12 text-center">
                <p className="text-[14px] font-medium text-ink">
                  No account matches “{query}”
                </p>
                <p className="mt-1.5 text-[12.5px] text-faint">
                  Try a client, a place, or a status like “dormant”.
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-4 rounded-lg border border-rule bg-plate px-3 py-1.5 text-[12.5px] text-muted transition-colors hover:border-plate-3 hover:text-ink"
                >
                  Clear the filter
                </button>
              </div>
            )}
          </div>

          <aside className="min-w-0 xl:sticky xl:top-5 xl:self-start">
            <Queue display={display} />
          </aside>
        </div>
      </div>
    </>
  );
}
