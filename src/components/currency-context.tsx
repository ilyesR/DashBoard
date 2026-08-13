"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { FX } from "@/lib/data";
import type { CurrencyCode } from "@/lib/types";

type Ctx = {
  display: CurrencyCode;
  setDisplay: (c: CurrencyCode) => void;
  /** 1 EUR buys this many AED. Every converted figure on screen derives from it. */
  rate: number;
  setRate: (r: number) => void;
  /** Whether the rate on screen is still the one shipped with the ledger. */
  rateEdited: boolean;
  /** Bumps whenever the numbers are recomputed. Keyed onto figures so the settle replays. */
  settleKey: number;
};

const CurrencyCtx = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [display, setDisplayState] = useState<CurrencyCode>("EUR");
  const [rate, setRateState] = useState<number>(FX.eurToAed);
  const [settleKey, setSettleKey] = useState(0);

  const setDisplay = useCallback((c: CurrencyCode) => {
    setDisplayState((prev) => {
      if (prev === c) return prev;
      setSettleKey((k) => k + 1);
      return c;
    });
  }, []);

  const setRate = useCallback((r: number) => {
    if (!Number.isFinite(r) || r <= 0) return;
    setRateState((prev) => {
      if (prev === r) return prev;
      setSettleKey((k) => k + 1);
      return r;
    });
  }, []);

  const value = useMemo(
    () => ({
      display,
      setDisplay,
      rate,
      setRate,
      rateEdited: rate !== FX.eurToAed,
      settleKey,
    }),
    [display, setDisplay, rate, setRate, settleKey],
  );

  return <CurrencyCtx.Provider value={value}>{children}</CurrencyCtx.Provider>;
}

export function useDisplayCurrency(): Ctx {
  const ctx = useContext(CurrencyCtx);
  if (!ctx) throw new Error("useDisplayCurrency must be used inside CurrencyProvider");
  return ctx;
}
