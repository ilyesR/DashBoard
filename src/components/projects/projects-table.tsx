"use client";

import Link from "next/link";
import { ACCOUNTS, ENTRIES, SELF_ACCOUNT_ID } from "@/lib/data";
import { convert, fmtDate, fmtMoney, fmtShort, HUE_VAR } from "@/lib/money";
import { useDisplayCurrency } from "@/components/currency-context";
import { IconArrow } from "@/components/icons";
import { Chip, StatusLabel } from "@/components/ui";

export function ProjectsTable() {
  const { display, rate } = useDisplayCurrency();
  const projects = ACCOUNTS.filter((a) => a.id !== SELF_ACCOUNT_ID);

  return (
    <section className="plate overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-rule-soft">
              <th scope="col" className="eyeline px-4 py-2.5 font-medium sm:px-5">
                Client
              </th>
              <th scope="col" className="eyeline px-3 py-2.5 font-medium">
                Status
              </th>
              <th scope="col" className="eyeline px-3 py-2.5 font-medium">
                Deal
              </th>
              <th scope="col" className="eyeline px-3 py-2.5 font-medium">
                Against contract
              </th>
              <th scope="col" className="eyeline px-3 py-2.5 font-medium">
                Last movement
              </th>
              <th scope="col" className="eyeline px-4 py-2.5 text-right font-medium sm:px-5">
                Earned in {display}
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((a) => {
              const rows = ENTRIES.filter((e) => e.accountId === a.id && e.amount > 0);
              const earned = rows.reduce(
                (t, e) => t + convert(e.amount, e.currency, display, rate),
                0,
              );
              const native = rows.reduce(
                (t, e) => t + convert(e.amount, e.currency, a.currency, rate),
                0,
              );
              const progress = a.contracted ? Math.min(1, native / a.contracted) : null;
              const last = [...rows].sort((x, y) => (x.date < y.date ? 1 : -1))[0];

              return (
                <tr
                  key={a.id}
                  className="group border-b border-rule-soft last:border-0 transition-colors hover:bg-plate-2"
                >
                  <th scope="row" className="px-4 py-3 text-left font-normal sm:px-5">
                    <Link href={`/projects/${a.id}`} className="flex items-center gap-2.5">
                      <span
                        className="size-2 shrink-0 rounded-[3px]"
                        style={{ background: HUE_VAR[a.hue] }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block text-[13px] font-semibold text-ink">{a.client}</span>
                        <span className="block text-[11.5px] text-faint">
                          {a.name} · {a.place}
                        </span>
                      </span>
                    </Link>
                  </th>
                  <td className="px-3 py-3">
                    <StatusLabel status={a.status} />
                  </td>
                  <td className="px-3 py-3">
                    <span className="tnum text-[12px] text-muted">{a.engagement}</span>
                    <span className="ml-2">
                      <Chip>{a.currency}</Chip>
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {progress !== null ? (
                      <span className="flex items-center gap-2.5">
                        <span className="h-[3px] w-[72px] shrink-0 overflow-hidden rounded-full bg-rule">
                          <span
                            className="block h-full rounded-full"
                            style={{
                              width: `${Math.max(progress * 100, 1.5)}%`,
                              background: HUE_VAR[a.hue],
                            }}
                          />
                        </span>
                        <span className="tnum text-[11.5px] text-faint">
                          {Math.round(progress * 100)}% of {fmtShort(a.contracted!, a.currency)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-[11.5px] text-faint">Ongoing retainer</span>
                    )}
                  </td>
                  <td className="tnum whitespace-nowrap px-3 py-3 text-[12px] text-faint">
                    {last ? fmtDate(last.date, "long") : "None on record"}
                  </td>
                  <td className="px-4 py-3 text-right sm:px-5">
                    <span className="tnum text-[13px] font-medium text-ink">
                      {fmtMoney(earned, display)}
                    </span>
                    {a.currency !== display ? (
                      <span className="tnum block text-[11px] text-faint">
                        {fmtMoney(native, a.currency)} as it landed
                      </span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="hair-t flex items-center justify-between px-4 py-3 text-[12px] text-faint sm:px-5">
        <span>
          <span className="tnum text-muted">{projects.length}</span> client projects. Personal
          spending lives on the board.
        </span>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-muted transition-colors hover:text-mint"
        >
          Back to the board
          <IconArrow size={15} />
        </Link>
      </div>
    </section>
  );
}
