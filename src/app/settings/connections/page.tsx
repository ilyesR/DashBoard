import Link from "next/link";
import { ENTRIES, UNATTRIBUTED } from "@/lib/data";
import { IconArrow, IconHand, IconSync } from "@/components/icons";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Connections — Meridian" };

const syncedCount = ENTRIES.filter((e) => e.source === "sync").length + UNATTRIBUTED.length;
const manualCount = ENTRIES.filter((e) => e.source === "manual").length;

export default function ConnectionsPage() {
  return (
    <>
      <PageHeader title="Connections" meta={<>Where movements come from</>} />

      <div className="flex max-w-[880px] flex-col gap-5 p-4 sm:p-5 xl:p-7">
        <section className="plate p-5">
          <div className="flex items-start gap-3.5">
            <span className="mt-0.5 text-mint">
              <IconHand size={20} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2.5">
                <h2 className="text-[14px] font-semibold tracking-[-0.01em]">By hand</h2>
                <span className="text-[11.5px] font-medium text-mint">Working</span>
              </div>
              <p className="mt-1.5 max-w-[62ch] text-[12.5px] leading-[1.6] text-muted">
                Log an entry from the board in either currency, against any project or against
                Personal. Manual entry is a first-class path here, not a fallback for when a sync
                fails — cash, foreign accounts and corrections all arrive this way.
              </p>
              <p className="tnum mt-3 text-[12px] text-faint">
                {manualCount} movements entered by hand in this ledger
              </p>
              <Link
                href="/"
                className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] text-muted transition-colors hover:text-mint"
              >
                Log an entry
                <IconArrow size={15} />
              </Link>
            </div>
          </div>
        </section>

        <section className="plate p-5">
          <div className="flex items-start gap-3.5">
            <span className="mt-0.5 text-amber">
              <IconSync size={20} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2.5">
                <h2 className="text-[14px] font-semibold tracking-[-0.01em]">Bank sync</h2>
                <span className="text-[11.5px] font-medium text-amber">No bank connected</span>
              </div>
              <p className="mt-1.5 max-w-[62ch] text-[12.5px] leading-[1.6] text-muted">
                Nothing is connected to a real account. The {syncedCount} movements marked{" "}
                <span className="text-ink">Synced</span> in this ledger are demonstration data
                written into the app, not transactions fetched from a bank.
              </p>

              <div className="mt-4 rounded-xl border border-dashed border-rule p-4">
                <div className="eyeline mb-2.5">Open decision</div>
                <p className="max-w-[62ch] text-[12.5px] leading-[1.6] text-muted">
                  Which aggregator connects the accounts has not been chosen. Euro and dirham
                  coverage do not overlap in the same products, so it is likely to be two
                  integrations rather than one, and that shapes the data model — reference strings,
                  arrival lag, and how much of the unattributed queue can be matched automatically.
                </p>
              </div>

              <Link
                href="/transactions/unattributed"
                className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-muted transition-colors hover:text-amber"
              >
                See what sync leaves behind
                <IconArrow size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
