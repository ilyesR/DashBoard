"use client";

import { useId, useRef, useState } from "react";
import { ACCOUNTS, AS_OF, SELF_ACCOUNT_ID, SPEND_CATEGORIES } from "@/lib/data";
import type { CurrencyCode, Entry } from "@/lib/types";
import { IconChevronDown, IconPlus } from "@/components/icons";
import { Segmented } from "@/components/ui";

const field =
  "w-full rounded-lg border border-rule bg-plate px-2.5 py-1.5 text-[12.5px] text-ink transition-colors hover:border-plate-3 focus:border-mint-4";

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${field} appearance-none pr-8`}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-faint">
        <IconChevronDown size={15} />
      </span>
    </div>
  );
}

/**
 * Manual entry is a first-class path, not a fallback, so it lives inline on the
 * board rather than behind a modal. What you add here moves every figure on screen.
 */
export function QuickEntryTrigger({ onOpen, open }: { onOpen: () => void; open: boolean }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={open}
      className="flex items-center gap-1.5 rounded-lg border border-rule bg-plate px-2.5 py-[6px] text-[12.5px] font-medium text-muted transition-colors hover:border-plate-3 hover:text-ink"
    >
      <IconPlus size={15} />
      Log an entry
    </button>
  );
}

export function QuickEntry({
  onAdd,
  onClose,
}: {
  onAdd: (entry: Entry) => void;
  onClose: () => void;
}) {
  const [direction, setDirection] = useState<"in" | "out">("in");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");
  const [accountId, setAccountId] = useState(ACCOUNTS[0].id);
  const [category, setCategory] = useState<string>(SPEND_CATEGORIES[0]);
  const [date, setDate] = useState(AS_OF);
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const errorId = useId();

  function reset() {
    setAmount("");
    setMemo("");
    setError(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount.replace(/[^0-9.]/g, ""));
    if (!amount.trim()) {
      setError("Enter an amount before adding this entry.");
      amountRef.current?.focus();
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      setError(`“${amount}” is not an amount. Use digits, for example 4200 or 1250.50.`);
      amountRef.current?.focus();
      return;
    }
    if (date > AS_OF) {
      setError(`The ledger runs to ${AS_OF}. Pick that date or earlier.`);
      return;
    }

    const isOut = direction === "out";
    onAdd({
      id: `manual-${Date.now()}`,
      accountId: isOut ? SELF_ACCOUNT_ID : accountId,
      date,
      amount: isOut ? -value : value,
      currency,
      counterparty: isOut
        ? memo.trim() || "Cash or card"
        : ACCOUNTS.find((a) => a.id === accountId)?.client ?? "Unknown",
      memo: memo.trim() || (isOut ? "Entered by hand" : "Entered by hand"),
      source: "manual",
      category: isOut ? category : undefined,
    });
    reset();
    amountRef.current?.focus();
  }

  const outgoing = direction === "out";

  return (
    <form
      onSubmit={submit}
      className="settle plate flex flex-col gap-3 p-3.5"
      aria-label="Log an entry by hand"
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <Segmented
          label="Direction"
          size="sm"
          value={direction}
          options={[
            { value: "in" as const, label: "Money in" },
            { value: "out" as const, label: "Money out" },
          ]}
          onChange={(v) => {
            setDirection(v);
            setError(null);
          }}
        />
        <span className="text-[11.5px] text-faint">
          {outgoing
            ? "Charged to Personal — everything that leaves."
            : "Attributed to the project that earned it."}
        </span>
        <button
          type="button"
          onClick={() => {
            reset();
            onClose();
          }}
          className="ml-auto rounded px-1.5 py-0.5 text-[12px] text-faint transition-colors hover:text-ink"
        >
          Close
        </button>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[128px_92px_1fr_136px_auto]">
        <input
          ref={amountRef}
          autoFocus
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError(null);
          }}
          inputMode="decimal"
          placeholder="Amount"
          aria-label="Amount"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${field} tnum ${error ? "border-rose" : ""}`}
        />
        <Select label="Currency" value={currency} onChange={(v) => setCurrency(v as CurrencyCode)}>
          <option value="EUR">EUR</option>
          <option value="AED">AED</option>
        </Select>

        {outgoing ? (
          <Select label="Category" value={category} onChange={setCategory}>
            {SPEND_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        ) : (
          <Select label="Account" value={accountId} onChange={setAccountId}>
            {ACCOUNTS.filter((a) => a.id !== SELF_ACCOUNT_ID).map((a) => (
              <option key={a.id} value={a.id}>
                {a.client} — {a.name}
              </option>
            ))}
          </Select>
        )}

        <input
          type="date"
          value={date}
          max={AS_OF}
          onChange={(e) => {
            setDate(e.target.value);
            setError(null);
          }}
          aria-label="Date"
          className={`${field} tnum`}
        />

        <button
          type="submit"
          className="rounded-lg bg-mint px-3.5 py-1.5 text-[12.5px] font-semibold text-[#04150E] transition-colors hover:bg-mint-1"
        >
          Add
        </button>
      </div>

      <input
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder={outgoing ? "What was it? Optional." : "What is it for? Optional."}
        aria-label="Note"
        className={field}
      />

      {error ? (
        <p id={errorId} role="alert" className="text-[12px] text-rose">
          {error}
        </p>
      ) : null}
    </form>
  );
}
