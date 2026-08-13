"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBoard,
  IconExchange,
  IconLedger,
  IconLink,
  IconQueue,
  IconWork,
  Mark,
} from "@/components/icons";
import { UNATTRIBUTED } from "@/lib/data";

type Item = {
  href: string;
  label: string;
  icon: (p: { size?: number }) => React.ReactElement;
  badge?: number;
};

const GROUPS: { label: string; items: Item[] }[] = [
  {
    label: "Position",
    items: [{ href: "/", label: "Board", icon: IconBoard }],
  },
  {
    label: "Money",
    items: [
      { href: "/transactions", label: "Transactions", icon: IconLedger },
      { href: "/transactions/unattributed", label: "Unattributed", icon: IconQueue, badge: UNATTRIBUTED.length },
    ],
  },
  {
    label: "Work",
    items: [{ href: "/projects", label: "Projects", icon: IconWork }],
  },
  {
    label: "Setup",
    items: [
      { href: "/settings", label: "Currency & rate", icon: IconExchange },
      { href: "/settings/connections", label: "Connections", icon: IconLink },
    ],
  },
];

const MOBILE_ITEMS: Item[] = [
  { href: "/", label: "Board", icon: IconBoard },
  { href: "/transactions", label: "Ledger", icon: IconLedger },
  { href: "/transactions/unattributed", label: "Queue", icon: IconQueue, badge: UNATTRIBUTED.length },
  { href: "/projects", label: "Work", icon: IconWork },
  { href: "/settings", label: "Setup", icon: IconExchange },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/transactions") return pathname === "/transactions";
  if (href === "/settings") return pathname === "/settings";
  return pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sections"
      className="sticky top-0 hidden h-screen w-[236px] shrink-0 flex-col border-r border-rule bg-void lg:flex"
    >
      <Link
        href="/"
        className="flex items-center gap-2.5 px-5 h-[62px] border-b border-rule-soft group"
      >
        <Mark size={26} id="mark-rail" />
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">Meridian</span>
      </Link>

      <div className="flex-1 overflow-y-auto py-5">
        {GROUPS.map((group) => (
          <div key={group.label} className="mb-6 px-3">
            <div className="eyeline px-2 pb-2.5">{group.label}</div>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "flex items-center gap-2.5 rounded-lg px-2 py-[7px] text-[13.5px] transition-colors duration-150",
                        active
                          ? "bg-mint-deep text-mint"
                          : "text-muted hover:bg-plate hover:text-ink",
                      ].join(" ")}
                    >
                      <Icon size={17} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge ? (
                        <span className="tnum rounded-full bg-amber-deep px-1.5 py-px text-[11px] font-medium text-amber">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-rule-soft px-5 py-4">
        <div className="flex items-center gap-2">
          <span
            className="size-1.5 rounded-full bg-amber"
            aria-hidden="true"
          />
          <span className="text-[11.5px] font-medium text-amber">Demo data</span>
        </div>
        <p className="mt-1 text-[11.5px] leading-[1.45] text-faint">
          Every client, figure and rate here is invented. Nothing is connected to a real account.
        </p>
      </div>
    </nav>
  );
}

export function MobileBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Sections"
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-rule bg-void/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
    >
      {MOBILE_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "relative flex flex-col items-center gap-1 py-2.5 text-[10.5px] tracking-[0.02em] transition-colors",
              active ? "text-mint" : "text-faint",
            ].join(" ")}
          >
            <Icon size={19} />
            {item.label}
            {item.badge ? (
              <span className="tnum absolute right-[22%] top-1.5 rounded-full bg-amber px-1 text-[9.5px] font-semibold leading-[14px] text-void">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileTop() {
  return (
    <header className="lg:hidden sticky top-0 z-30 flex h-[54px] items-center gap-2.5 border-b border-rule bg-void/95 px-4 backdrop-blur-md">
      <Mark size={23} id="mark-top" />
      <span className="text-[14.5px] font-semibold tracking-[-0.01em]">Meridian</span>
      <span className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-amber">
        <span className="size-1.5 rounded-full bg-amber" aria-hidden="true" />
        Demo data
      </span>
    </header>
  );
}
