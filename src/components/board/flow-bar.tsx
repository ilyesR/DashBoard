"use client";

import { useMemo, useState } from "react";
import { ACCOUNTS, AS_OF, FX, SELF_ACCOUNT_ID } from "@/lib/data";
import {
  convert,
  fmtDate,
  fmtMoney,
  HUE_VAR,
  inPeriod,
  monthKeys,
  monthLabel,
  PERIODS,
  type PeriodKey,
} from "@/lib/money";
import type { CurrencyCode, Entry } from "@/lib/types";
import { useDisplayCurrency } from "@/components/currency-context";
import { Segmented } from "@/components/ui";

const INCOME_H = 118;
const LABEL_H = 22;

type Seg = { key: string; label: string; value: number; fill: string; accountId: string };

/**
 * The instrument the whole board reads against: one axis, income rising above it,
 * spending falling below it, on a single shared scale so the asymmetry between the
 * two is the first thing visible. The net resolves at the axis's right-hand end.
 *
 * Nothing here is clamped. The area below the axis is sized from the worst month
 * at the same scale as the area above it, because a truncated money bar lies.
 */
export function FlowBar({
  entries,
  display,
  setDisplay,
  period,
  setPeriod,
  focus,
  setFocus,
  settleKey,
}: {
  entries: Entry[];
  display: CurrencyCode;
  setDisplay: (c: CurrencyCode) => void;
  period: PeriodKey;
  setPeriod: (p: PeriodKey) => void;
  focus: string | null;
  setFocus: (id: string | null) => void;
  settleKey: number;
}) {
  const [hoverMonth, setHoverMonth] = useState<string | null>(null);
  const { rate, rateEdited } = useDisplayCurrency();

  const model = useMemo(() => {
    const keys = monthKeys(period);
    const scoped = entries.filter((e) => inPeriod(e, period));

    const columns = keys.map((key) => {
      const rows = scoped.filter((e) => e.date.startsWith(key));

      const income: Seg[] = ACCOUNTS.filter((a) => a.id !== SELF_ACCOUNT_ID)
        .map((a) => ({
          key: `${key}-${a.id}`,
          label: a.client,
          accountId: a.id,
          fill: HUE_VAR[a.hue],
          value: rows
            .filter((e) => e.accountId === a.id && e.amount > 0)
            .reduce((t, e) => t + convert(e.amount, e.currency, display, rate), 0),
        }))
        .filter((s) => s.value > 0)
        // Ascending, so the account carrying the month sits on the axis.
        .sort((a, b) => a.value - b.value);

      // One band below the axis, not a category stack. On a scale where income
      // is four times spending, category bands render as slivers and read as
      // noise; the breakdown belongs on the Personal card, where it has room.
      const outTotal = rows
        .filter((e) => e.amount < 0)
        .reduce((t, e) => t + Math.abs(convert(e.amount, e.currency, display, rate)), 0);

      return {
        key,
        income,
        outTotal,
        inTotal: income.reduce((t, s) => t + s.value, 0),
      };
    });

    const peak = Math.max(1, ...columns.map((c) => c.inTotal));
    const perUnit = INCOME_H / peak;
    const worstOut = Math.max(0, ...columns.map((c) => c.outTotal));
    // Sized from the data at the shared scale, with a floor so an all-income
    // period still shows an axis to read against.
    const spendH = Math.max(26, Math.ceil(worstOut * perUnit) + 8);

    return {
      columns,
      perUnit,
      spendH,
      totalIn: columns.reduce((t, c) => t + c.inTotal, 0),
      totalOut: columns.reduce((t, c) => t + c.outTotal, 0),
      net: columns.reduce((t, c) => t + c.inTotal - c.outTotal, 0),
    };
  }, [entries, period, display, rate]);

  const periodFull = PERIODS.find((p) => p.key === period)!.full;
  const active = hoverMonth ? model.columns.find((c) => c.key === hoverMonth) : null;
  const colH = INCOME_H + model.spendH + LABEL_H;

  function enter(accountId: string, monthKey: string) {
    setFocus(accountId);
    setHoverMonth(monthKey);
  }
  function leave() {
    setFocus(null);
    setHoverMonth(null);
  }

  return (
    <section
      aria-labelledby="flow-heading"
      className="plate overflow-hidden"
      onMouseLeave={leave}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule-soft px-4 py-3 sm:px-5">
        <div className="flex items-baseline gap-2.5">
          <h2 id="flow-heading" className="text-[13.5px] font-semibold tracking-[-0.01em]">
            Flow
          </h2>
          <span className="text-[12px] text-faint">
            {active ? (
              <>
                {monthLabel(active.key)} {active.key.slice(0, 4)} · in{" "}
                <span className="tnum text-mint">{fmtMoney(active.inTotal, display)}</span> · out{" "}
                <span className="tnum text-rose">{fmtMoney(active.outTotal, display)}</span>
              </>
            ) : (
              periodFull
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Segmented
            label="Period"
            size="sm"
            value={period}
            options={PERIODS.map((p) => ({ value: p.key, label: p.label, title: p.full }))}
            onChange={setPeriod}
          />
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
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="relative min-w-0 flex-1 px-4 pt-5 sm:px-5">
          {/* the axis: one line the whole instrument is measured from */}
          <div
            className="pointer-events-none absolute inset-x-0 border-t border-rule"
            style={{ top: 20 + INCOME_H }}
            aria-hidden="true"
          />
          <div className="flex items-end gap-1.5 sm:gap-2.5" style={{ height: colH }}>
            {model.columns.map((col, ci) => {
              const dim = focus !== null;
              const year = col.key.slice(0, 4);
              return (
                <div key={col.key} className="flex flex-1 flex-col" style={{ height: colH }}>
                  {/* Each band is its own control, so hovering or tabbing to it
                      lights the account's card on the board — the reverse of the
                      card lighting the band. */}
                  <div className="flex flex-col justify-end gap-px" style={{ height: INCOME_H }}>
                    {col.income.map((s, i) => (
                      <button
                        key={`${s.key}-${settleKey}`}
                        type="button"
                        onMouseEnter={() => enter(s.accountId, col.key)}
                        onMouseLeave={leave}
                        onFocus={() => enter(s.accountId, col.key)}
                        onBlur={leave}
                        aria-label={`${s.label}, ${monthLabel(col.key)} ${year}: ${fmtMoney(
                          s.value,
                          display,
                        )} in`}
                        className="rise block w-full rounded-[1px] outline-offset-2 transition-opacity duration-200 first:rounded-t-[3px]"
                        style={{
                          height: Math.max(2, s.value * model.perUnit),
                          background: s.fill,
                          opacity: dim && focus !== s.accountId ? 0.16 : 1,
                          animationDelay: `${ci * 55 + i * 18}ms`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col" style={{ height: model.spendH }}>
                    {col.outTotal > 0 ? (
                      <button
                        type="button"
                        key={`${col.key}-out-${settleKey}`}
                        onMouseEnter={() => enter(SELF_ACCOUNT_ID, col.key)}
                        onMouseLeave={leave}
                        onFocus={() => enter(SELF_ACCOUNT_ID, col.key)}
                        onBlur={leave}
                        aria-label={`Personal, ${monthLabel(col.key)} ${year}: ${fmtMoney(
                          col.outTotal,
                          display,
                        )} out`}
                        className="rise-down block w-full rounded-b-[3px] outline-offset-2 transition-opacity duration-200"
                        style={{
                          height: Math.max(4, col.outTotal * model.perUnit),
                          background: "var(--color-rose)",
                          opacity: dim && focus !== SELF_ACCOUNT_ID ? 0.16 : 1,
                          animationDelay: `${ci * 55 + 90}ms`,
                        }}
                      />
                    ) : null}
                  </div>

                  <div
                    className="flex items-end justify-center text-[10.5px] tracking-[0.06em] text-faint"
                    style={{ height: LABEL_H }}
                  >
                    {monthLabel(col.key)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* The readout: the axis runs into it and resolves. */}
        <div className="relative flex shrink-0 flex-col justify-center border-t border-rule-soft px-4 py-5 sm:px-5 md:w-[248px] md:border-l md:border-t-0">
          <div className="eyeline">Net · {periodFull}</div>
          <div
            key={`net-${settleKey}-${period}`}
            className="settle tnum mt-2 text-[38px] font-semibold leading-none tracking-[-0.03em] text-ink"
          >
            {fmtMoney(model.net, display)}
          </div>
          <dl className="mt-3.5 flex gap-5 text-[12px]">
            <div>
              <dt className="text-faint">In</dt>
              <dd className="tnum mt-0.5 font-medium text-mint">
                {fmtMoney(model.totalIn, display)}
              </dd>
            </div>
            <div>
              <dt className="text-faint">Out</dt>
              <dd className="tnum mt-0.5 font-medium text-rose">
                {fmtMoney(model.totalOut, display)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="hair-t px-4 py-2.5 text-[11.5px] leading-[1.55] text-faint sm:px-5">
        <span className="tnum text-muted">1 EUR = {rate.toFixed(4)} AED</span> ·{" "}
        {rateEdited ? (
          <>
            your rate, replacing the {FX.eurToAed} entered on {fmtDate(FX.setOn)}
          </>
        ) : (
          <>entered by hand on {fmtDate(FX.setOn)}, not a live feed</>
        )}
        . Every converted figure above moves with it. Ledger current to {fmtDate(AS_OF, "long")}.
      </p>
    </section>
  );
}
