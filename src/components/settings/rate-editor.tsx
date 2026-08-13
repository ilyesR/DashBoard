"use client";

import { useState } from "react";
import { FX } from "@/lib/data";
import { convert, fmtDate, fmtMoney } from "@/lib/money";
import { useDisplayCurrency } from "@/components/currency-context";
import { Segmented } from "@/components/ui";
import type { CurrencyCode } from "@/lib/types";

const WORKED_EXAMPLES: { amount: number; from: CurrencyCode }[] = [
  { amount: 22000, from: "AED" },
  { amount: 4200, from: "EUR" },
];

export function RateEditor() {
  const { display, setDisplay, rate, setRate, rateEdited } = useDisplayCurrency();
  const [draft, setDraft] = useState(String(FX.eurToAed));
  const [error, setError] = useState<string | null>(null);

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(draft.replace(",", "."));
    if (!Number.isFinite(value) || value <= 0) {
      setError(`“${draft}” is not a rate. Enter how many AED one euro buys, for example 4.1912.`);
      return;
    }
    if (value > 20 || value < 0.5) {
      setError("That is far outside anything the euro has traded at against the dirham. Check it.");
      return;
    }
    setError(null);
    setRate(value);
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="plate p-5">
        <h2 className="text-[14px] font-semibold tracking-[-0.01em]">Display currency</h2>
        <p className="mt-1.5 max-w-[62ch] text-[12.5px] leading-[1.6] text-muted">
          Neither currency is the home currency. Pick which one totals roll up into and everything
          reconverts; each movement keeps the currency it actually moved in either way.
        </p>
        <div className="mt-4">
          <Segmented
            label="Display currency"
            value={display}
            options={[
              { value: "EUR" as CurrencyCode, label: "Euro" },
              { value: "AED" as CurrencyCode, label: "Dirham" },
            ]}
            onChange={setDisplay}
          />
        </div>
      </section>

      <section className="plate p-5">
        <h2 className="text-[14px] font-semibold tracking-[-0.01em]">The rate</h2>
        <p className="mt-1.5 max-w-[62ch] text-[12.5px] leading-[1.6] text-muted">
          Meridian does not fetch rates. Until a source is chosen, the number below is whatever you
          set, and every converted figure in the app inherits that assumption — including totals for
          months that closed long ago.
        </p>

        <form onSubmit={apply} className="mt-4 flex flex-wrap items-start gap-2.5">
          <label className="flex items-center gap-2.5">
            <span className="text-[12.5px] text-faint">1 EUR =</span>
            <input
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setError(null);
              }}
              inputMode="decimal"
              aria-label="Dirhams per euro"
              aria-invalid={error ? true : undefined}
              className={`tnum w-[104px] rounded-lg border bg-plate px-2.5 py-1.5 text-[13px] transition-colors hover:border-plate-3 focus:border-mint-4 ${
                error ? "border-rose" : "border-rule"
              }`}
            />
            <span className="text-[12.5px] text-faint">AED</span>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-mint px-3.5 py-1.5 text-[12.5px] font-semibold text-[#04150E] transition-colors hover:bg-mint-1"
          >
            Apply
          </button>
          {rateEdited ? (
            <button
              type="button"
              onClick={() => {
                setDraft(String(FX.eurToAed));
                setRate(FX.eurToAed);
                setError(null);
              }}
              className="rounded-lg border border-rule bg-plate px-3 py-1.5 text-[12.5px] text-muted transition-colors hover:border-plate-3 hover:text-ink"
            >
              Back to {FX.eurToAed}
            </button>
          ) : null}
        </form>

        {error ? (
          <p role="alert" className="mt-2.5 text-[12px] text-rose">
            {error}
          </p>
        ) : null}

        <div className="mt-5 border-t border-rule-soft pt-4">
          <div className="eyeline mb-3">In force now</div>
          <dl className="flex flex-wrap gap-x-10 gap-y-3 text-[12.5px]">
            <div>
              <dt className="text-faint">Rate</dt>
              <dd className="tnum mt-0.5 text-ink">1 EUR = {rate.toFixed(4)} AED</dd>
            </div>
            <div>
              <dt className="text-faint">Source</dt>
              <dd className="mt-0.5 text-amber">
                {rateEdited ? "Entered by you, this session" : "Entered by hand"}
              </dd>
            </div>
            <div>
              <dt className="text-faint">Set on</dt>
              <dd className="tnum mt-0.5 text-muted">
                {rateEdited ? "Just now" : fmtDate(FX.setOn, "long")}
              </dd>
            </div>
          </dl>

          <ul className="mt-4 flex flex-col gap-1.5">
            {WORKED_EXAMPLES.map((ex) => {
              const to: CurrencyCode = ex.from === "EUR" ? "AED" : "EUR";
              return (
                <li key={ex.from} className="tnum text-[12.5px] text-muted">
                  {fmtMoney(ex.amount, ex.from)}
                  <span className="mx-2 text-faint">becomes</span>
                  {fmtMoney(convert(ex.amount, ex.from, to, rate), to, { cents: true })}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="plate p-5">
        <h2 className="text-[14px] font-semibold tracking-[-0.01em]">Still undecided</h2>
        <p className="mt-1.5 max-w-[62ch] text-[12.5px] leading-[1.6] text-muted">
          Whether the rate should come from a live feed, a snapshot taken on the day each movement
          landed, or your own hand is an open product decision. It matters: a live feed makes last
          March&rsquo;s total move every time you open the app, and a per-movement snapshot does not.
          Nothing here pretends the question is settled.
        </p>
      </section>
    </div>
  );
}
