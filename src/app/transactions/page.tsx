import { ENTRIES } from "@/lib/data";
import { CurrencySwitch, Ledger, type Flow } from "@/components/ledger/ledger";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Transactions — Meridian" };

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ flow?: string }>;
}) {
  const { flow } = await searchParams;
  const initialFlow: Flow = flow === "in" || flow === "out" ? flow : "all";

  return (
    <>
      <PageHeader
        title="Transactions"
        meta={<>Every movement, in the currency it moved in and as converted</>}
      >
        <CurrencySwitch />
      </PageHeader>
      <div className="p-4 sm:p-5 xl:p-7">
        <Ledger entries={ENTRIES} initialFlow={initialFlow} />
      </div>
    </>
  );
}
