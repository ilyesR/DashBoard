export type CurrencyCode = "EUR" | "AED";

export type AccountStatus = "active" | "wrapping" | "dormant" | "closed" | "self";

/**
 * An account is either a client project that earns, or you.
 * Both are the same object on purpose: the board reads as one system of
 * accounts, not a finance screen with a projects widget bolted on.
 */
export interface Account {
  id: string;
  /** The work itself. "Wayfinding program". */
  name: string;
  /** Who pays, or "You". */
  client: string;
  place: string;
  status: AccountStatus;
  /** Currency of record — the one the deal is actually written in. */
  currency: CurrencyCode;
  /** The deal in plain words. Shown verbatim; never computed from. */
  engagement: string;
  /** Contracted total, in the currency of record. Null for retainers and for you. */
  contracted: number | null;
  startedOn: string;
  /** 1–5, a step on the mint ramp. Identity never introduces a new hue. */
  hue: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

export type EntrySource = "manual" | "sync";

export interface Entry {
  id: string;
  /** null means the entry has arrived but has no home yet — the triage queue. */
  accountId: string | null;
  date: string;
  /** Positive is money in, negative is money out. In `currency`. */
  amount: number;
  currency: CurrencyCode;
  counterparty: string;
  memo: string;
  source: EntrySource;
  category?: string;
}

export interface FxRate {
  /** 1 EUR buys this many AED. */
  eurToAed: number;
  setOn: string;
  /** Where the number came from. Never implied, always stated. */
  provenance: "manual" | "feed";
}
