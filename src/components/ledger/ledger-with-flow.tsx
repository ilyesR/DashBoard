"use client";

import { useSearchParams } from "next/navigation";
import { ENTRIES } from "@/lib/data";
import { Ledger, type Flow } from "./ledger";

/**
 * Reads ?flow=out on the client. A static export has no server to read a query
 * string on, so this runs after hydration inside a Suspense boundary and the
 * unfiltered ledger renders first.
 */
export function LedgerWithFlow() {
  const params = useSearchParams();
  const raw = params.get("flow");
  const initialFlow: Flow = raw === "in" || raw === "out" ? raw : "all";
  return <Ledger key={initialFlow} entries={ENTRIES} initialFlow={initialFlow} />;
}
