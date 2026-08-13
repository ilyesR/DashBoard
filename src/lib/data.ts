import type { Account, Entry, FxRate } from "./types";

/**
 * DEMO DATA — synthetic throughout. No client, figure, or rate below is real.
 * The dataset is frozen to a fixed "as of" date so the demo does not drift
 * against a live clock. Replace wholesale when real accounts arrive.
 */
export const AS_OF = "2026-08-11";

export const FX: FxRate = {
  eurToAed: 4.1912,
  setOn: "2026-08-03",
  provenance: "manual",
};

export const ACCOUNTS: Account[] = [
  {
    id: "halcyon",
    name: "Brand system",
    client: "Halcyon Studio",
    place: "Berlin",
    status: "active",
    currency: "EUR",
    engagement: "Retainer · €4,200 / month",
    contracted: null,
    startedOn: "2025-11-01",
    hue: 2,
  },
  {
    id: "marasi",
    name: "Wayfinding program",
    client: "Marasi Development",
    place: "Dubai",
    status: "active",
    currency: "AED",
    engagement: "Fixed fee · AED 96,000",
    contracted: 96000,
    startedOn: "2026-02-16",
    hue: 1,
  },
  {
    id: "sana",
    name: "Design system",
    client: "Sana Health",
    place: "Abu Dhabi",
    status: "active",
    currency: "AED",
    engagement: "Retainer · AED 22,000 / month",
    contracted: null,
    startedOn: "2026-04-01",
    hue: 3,
  },
  {
    id: "verdigris",
    name: "Editorial platform",
    client: "Verdigris Press",
    place: "Amsterdam",
    status: "wrapping",
    currency: "EUR",
    engagement: "Fixed fee · €18,500",
    contracted: 18500,
    startedOn: "2026-01-20",
    hue: 4,
    note: "Final 20% landed 4 Aug. Closing once the handover doc is signed.",
  },
  {
    id: "atlas",
    name: "Signage refresh",
    client: "Atlas Rail",
    place: "Lyon",
    status: "closed",
    currency: "EUR",
    engagement: "Fixed fee · €31,000",
    contracted: 31000,
    startedOn: "2025-09-08",
    hue: 5,
    note: "Delivered and paid in full. Kept on the board through the period it earned in.",
  },
  {
    id: "kite",
    name: "Identity",
    client: "Kite & Anchor",
    place: "Rotterdam",
    status: "dormant",
    currency: "EUR",
    engagement: "Fixed fee · €9,600",
    contracted: 9600,
    startedOn: "2026-01-06",
    hue: 5,
    note: "Nothing since February. Client paused pending their funding round.",
  },
  {
    id: "self",
    name: "Personal",
    client: "You",
    place: "Berlin · Dubai",
    status: "self",
    currency: "EUR",
    engagement: "Everything that leaves",
    contracted: null,
    startedOn: "2025-01-01",
    hue: 3,
  },
];

export const SELF_ACCOUNT_ID = "self";

let seq = 0;
const id = (p: string) => `${p}-${(++seq).toString().padStart(3, "0")}`;

function income(
  accountId: string,
  date: string,
  amount: number,
  currency: "EUR" | "AED",
  counterparty: string,
  memo: string,
  source: Entry["source"] = "sync",
): Entry {
  return { id: id("in"), accountId, date, amount, currency, counterparty, memo, source };
}

function spend(
  date: string,
  amount: number,
  currency: "EUR" | "AED",
  counterparty: string,
  category: string,
  memo: string,
  source: Entry["source"] = "sync",
): Entry {
  return {
    id: id("out"),
    accountId: SELF_ACCOUNT_ID,
    date,
    amount: -Math.abs(amount),
    currency,
    counterparty,
    memo,
    source,
    category,
  };
}

const MONTHS = ["2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"] as const;

const INCOME: Entry[] = [
  // Halcyon — monthly retainer, paid on the first.
  ...MONTHS.map((m) =>
    income("halcyon", `${m}-01`, 4200, "EUR", "Halcyon Studio GmbH", "Retainer — brand system"),
  ),

  // Marasi — milestone billing against a fixed fee.
  income("marasi", "2026-03-18", 24000, "AED", "Marasi Development LLC", "Milestone 2 — concourse survey"),
  income("marasi", "2026-05-06", 24000, "AED", "Marasi Development LLC", "Milestone 3 — sign family"),
  income("marasi", "2026-07-22", 28800, "AED", "Marasi Development LLC", "Milestone 4 — production art"),

  // Sana — retainer from April.
  income("sana", "2026-04-05", 22000, "AED", "Sana Health FZ-LLC", "Retainer — design system"),
  income("sana", "2026-05-05", 22000, "AED", "Sana Health FZ-LLC", "Retainer — design system"),
  income("sana", "2026-06-05", 22000, "AED", "Sana Health FZ-LLC", "Retainer — design system"),
  income("sana", "2026-07-06", 22000, "AED", "Sana Health FZ-LLC", "Retainer — design system"),
  income("sana", "2026-08-05", 22000, "AED", "Sana Health FZ-LLC", "Retainer — design system"),

  // Verdigris — 40 / 40 / 20 against a fixed fee.
  income("verdigris", "2026-03-02", 7400, "EUR", "Verdigris Press BV", "Stage 1 — 40%"),
  income("verdigris", "2026-06-12", 7400, "EUR", "Verdigris Press BV", "Stage 2 — 40%"),
  income("verdigris", "2026-08-04", 3700, "EUR", "Verdigris Press BV", "Final — 20%", "manual"),

  // Kite & Anchor — a deposit in February and nothing since. Sits outside the
  // six-month window on purpose: the card has to survive an account with no
  // movement in the period but a real history behind it.
  income("kite", "2026-02-10", 2880, "EUR", "Kite & Anchor BV", "Deposit — 30%"),

  // Atlas Rail — closed out inside the window.
  income("atlas", "2026-03-09", 15500, "EUR", "Atlas Rail SA", "Balance on delivery"),
  income("atlas", "2026-04-20", 15500, "EUR", "Atlas Rail SA", "Retention released"),
];

const RECURRING: Entry[] = MONTHS.flatMap((m) => [
  spend(`${m}-01`, 1450, "EUR", "Wohnbau Kreuzberg", "Rent", "Flat — Berlin"),
  spend(`${m}-03`, 412, "EUR", "Techniker Krankenkasse", "Health", "Health insurance"),
  spend(`${m}-04`, 1200, "AED", "Nest Coworking DIFC", "Workspace", "Desk — Dubai"),
  spend(`${m}-08`, 186, "EUR", "Assorted vendors", "Software", "Design and dev subscriptions"),
  spend(`${m}-12`, 268, "EUR", "Edeka / Rewe", "Food", "Groceries"),
  spend(`${m}-24`, 241, "AED", "Spinneys", "Food", "Groceries"),
]);

const ONE_OFFS: Entry[] = [
  spend("2026-03-31", 480, "EUR", "Küster Steuerberatung", "Professional", "Q1 bookkeeping", "manual"),
  spend("2026-04-14", 2340, "AED", "Emirates", "Travel", "DXB → BER, return"),
  spend("2026-05-22", 2890, "EUR", "Gravis", "Equipment", "Display and colour probe"),
  spend("2026-06-30", 6200, "EUR", "Finanzamt Friedrichshain", "Tax", "Q2 advance payment", "manual"),
  spend("2026-07-03", 486, "EUR", "Deutsche Bahn", "Travel", "Lyon site visit"),
  spend("2026-07-19", 940, "AED", "Etisalat", "Utilities", "Annual line and data"),
  spend("2026-08-02", 1120, "EUR", "Kammer für Gestaltung", "Professional", "Membership and liability cover"),
];

/** Arrived from the bank, no home yet. This queue is the daily job. */
export const UNATTRIBUTED: Entry[] = [
  {
    id: "u-1",
    accountId: null,
    date: "2026-08-07",
    amount: 12400,
    currency: "AED",
    counterparty: "MARASI DEV LLC",
    memo: "INWARD TT / REF 88410-2",
    source: "sync",
  },
  {
    id: "u-2",
    accountId: null,
    date: "2026-08-06",
    amount: 2100,
    currency: "EUR",
    counterparty: "STRIPE PAYMENTS EUROPE",
    memo: "PAYOUT po_1QxK4",
    source: "sync",
  },
  {
    id: "u-3",
    accountId: null,
    date: "2026-08-05",
    amount: -64.3,
    currency: "EUR",
    counterparty: "APPLE.COM/BILL",
    memo: "CARD 4412 · RECURRING",
    source: "sync",
  },
  {
    id: "u-4",
    accountId: null,
    date: "2026-08-03",
    amount: -890,
    currency: "AED",
    counterparty: "CARREFOUR MOE",
    memo: "CARD 7731 · POS",
    source: "sync",
  },
  {
    id: "u-5",
    accountId: null,
    date: "2026-07-31",
    amount: 5000,
    currency: "EUR",
    counterparty: "H. STUDIO GMBH",
    memo: "SEPA CREDIT · NO REFERENCE",
    source: "sync",
  },
];

/** Nothing may be dated past the day the ledger claims to be current to. */
export const ENTRIES: Entry[] = [...INCOME, ...RECURRING, ...ONE_OFFS]
  .filter((e) => e.date <= AS_OF)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export const SPEND_CATEGORIES = [
  "Rent",
  "Health",
  "Workspace",
  "Software",
  "Food",
  "Travel",
  "Equipment",
  "Tax",
  "Professional",
  "Utilities",
] as const;

export function accountById(accountId: string): Account | undefined {
  return ACCOUNTS.find((a) => a.id === accountId);
}

export function entriesFor(accountId: string): Entry[] {
  return ENTRIES.filter((e) => e.accountId === accountId);
}
