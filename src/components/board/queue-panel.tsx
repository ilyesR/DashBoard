"use client";

import Link from "next/link";
import { UNATTRIBUTED } from "@/lib/data";
import { convert, fmtDate, fmtMoney } from "@/lib/money";
import { useDisplayCurrency } from "@/components/currency-context";
import { IconArrow } from "@/components/icons";
import { Queue } from "./queue";

export function QueuePanel() {
  const { display, rate } = useDisplayCurrency();

  const inbound = UNATTRIBUTED.filter((e) => e.amount > 0);
  const outbound = UNATTRIBUTED.filter((e) => e.amount < 0);
  const sum = (list: typeof UNATTRIBUTED) =>
    list.reduce((t, e) => t + Math.abs(convert(e.amount, e.currency, display, rate)), 0);
  const oldest = [...UNATTRIBUTED].sort((a, b) => (a.date < b.date ? -1 : 1))[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-9">
      <aside className="flex flex-col gap-5">
        <section className="plate p-4">
          <div className="eyeline">Waiting on you</div>
          <dl className="mt-3 flex flex-col gap-3 text-[12.5px]">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-faint">Coming in</dt>
              <dd className="tnum text-mint">
                {inbound.length} · {fmtMoney(sum(inbound), display)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-faint">Going out</dt>
              <dd className="tnum text-rose">
                {outbound.length} · {fmtMoney(sum(outbound), display)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-rule-soft pt-3">
              <dt className="text-faint">Oldest</dt>
              <dd className="tnum text-muted">{oldest ? fmtDate(oldest.date, "long") : "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="plate p-4">
          <div className="eyeline">Why these are here</div>
          <p className="mt-2.5 text-[12.5px] leading-[1.6] text-muted">
            A bank transfer carries whatever reference the sender typed, and often none at all. Until
            a movement is attached to an account it counts toward nothing — not a project&rsquo;s
            earnings, not your spending, not the net on the board.
          </p>
          <Link
            href="/settings/connections"
            className="mt-3.5 inline-flex items-center gap-1.5 text-[12.5px] text-muted transition-colors hover:text-amber"
          >
            How movements arrive
            <IconArrow size={15} />
          </Link>
        </section>
      </aside>

      <Queue display={display} wide />
    </div>
  );
}
