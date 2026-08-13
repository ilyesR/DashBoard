import { UNATTRIBUTED } from "@/lib/data";
import { CurrencySwitch } from "@/components/ledger/ledger";
import { QueuePanel } from "@/components/board/queue-panel";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Unattributed — Meridian" };

export default function UnattributedPage() {
  return (
    <>
      <PageHeader
        title="Unattributed"
        meta={
          <>
            {UNATTRIBUTED.length} synced movements with nobody to belong to
          </>
        }
      >
        <CurrencySwitch />
      </PageHeader>
      <div className="p-4 sm:p-5 xl:p-7">
        <QueuePanel />
      </div>
    </>
  );
}
