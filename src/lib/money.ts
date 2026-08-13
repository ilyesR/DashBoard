import { AS_OF } from "./data";
import type { CurrencyCode, Entry } from "./types";

/**
 * Every figure on screen is derived through here, and the rate is always passed
 * in rather than read from a module, so no conversion can outlive the rate that
 * produced it.
 */
export function convert(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rate: number,
): number {
  if (from === to) return amount;
  return from === "EUR" ? amount * rate : amount / rate;
}

const SYMBOL: Record<CurrencyCode, string> = { EUR: "€", AED: "AED " };

export function fmtMoney(
  amount: number,
  currency: CurrencyCode,
  opts: { cents?: boolean; sign?: boolean } = {},
): string {
  const { cents = false, sign = false } = opts;
  const abs = Math.abs(amount);
  const body = abs.toLocaleString("en-GB", {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
  const lead = sign ? (amount < 0 ? "−" : "+") : amount < 0 ? "−" : "";
  return `${lead}${SYMBOL[currency]}${body}`;
}

/** For axis ticks and dense columns where the full figure would not fit. */
export function fmtShort(amount: number, currency: CurrencyCode): string {
  const abs = Math.abs(amount);
  const lead = amount < 0 ? "−" : "";
  if (abs >= 1000) {
    const k = abs / 1000;
    return `${lead}${SYMBOL[currency]}${k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `${lead}${SYMBOL[currency]}${Math.round(abs)}`;
}

export function fmtDate(iso: string, style: "short" | "long" = "short"): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: style === "long" ? "numeric" : undefined,
    timeZone: "UTC",
  });
}

export function monthLabel(key: string): string {
  const d = new Date(`${key}-01T00:00:00Z`);
  return d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
}

export type PeriodKey = "30d" | "6m" | "ytd";

export const PERIODS: { key: PeriodKey; label: string; full: string }[] = [
  { key: "30d", label: "30d", full: "Last 30 days" },
  { key: "6m", label: "6M", full: "Last 6 months" },
  { key: "ytd", label: "YTD", full: "Year to date" },
];

export function periodStart(period: PeriodKey): string {
  const asOf = new Date(`${AS_OF}T00:00:00Z`);
  if (period === "ytd") return `${asOf.getUTCFullYear()}-01-01`;
  const d = new Date(asOf);
  if (period === "30d") d.setUTCDate(d.getUTCDate() - 30);
  else d.setUTCMonth(d.getUTCMonth() - 5, 1);
  return d.toISOString().slice(0, 10);
}

export function inPeriod(entry: Entry, period: PeriodKey): boolean {
  return entry.date >= periodStart(period) && entry.date <= AS_OF;
}

/** Ordered month keys covering the period, oldest first. */
export function monthKeys(period: PeriodKey): string[] {
  const start = new Date(`${periodStart(period).slice(0, 7)}-01T00:00:00Z`);
  const end = new Date(`${AS_OF.slice(0, 7)}-01T00:00:00Z`);
  const keys: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    keys.push(cursor.toISOString().slice(0, 7));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return keys;
}

export function sumIn(entries: Entry[], display: CurrencyCode, rate: number): number {
  return entries
    .filter((e) => e.amount > 0)
    .reduce((t, e) => t + convert(e.amount, e.currency, display, rate), 0);
}

export function sumOut(entries: Entry[], display: CurrencyCode, rate: number): number {
  return entries
    .filter((e) => e.amount < 0)
    .reduce((t, e) => t + Math.abs(convert(e.amount, e.currency, display, rate)), 0);
}

export const HUE_VAR: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "var(--color-mint-1)",
  2: "var(--color-mint-2)",
  3: "var(--color-mint-3)",
  4: "var(--color-mint-4)",
  5: "var(--color-mint-5)",
};
