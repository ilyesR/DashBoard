import { Suspense } from "react";
import { ENTRIES } from "@/lib/data";
import { CurrencySwitch, Ledger } from "@/components/ledger/ledger";
import { LedgerWithFlow } from "@/components/ledger/ledger-with-flow";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Transactions — Meridian" };

export default function TransactionsPage() {
  return (
    <>
      <PageHeader
        title="Transactions"
        meta={<>Every movement, in the currency it moved in and as converted</>}
      >
        <CurrencySwitch />
      </PageHeader>
      <div className="p-4 sm:p-5 xl:p-7">
        <Suspense fallback={<Ledger entries={ENTRIES} />}>
          <LedgerWithFlow />
        </Suspense>
      </div>
    </>
  );
}
