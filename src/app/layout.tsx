import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/components/currency-context";
import { MobileBar, MobileTop, Sidebar } from "@/components/shell/sidebar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meridian — position, projects, and what has no home yet",
  description:
    "One board for a freelancer's money: every project and your own life as peer accounts, in EUR or AED.",
};

const CONTRACT = `<!--
THESIS: Every client project and your own life are peer accounts on one board; refuses the
KPI-tiles-and-charts dashboard that treats income as a flat stream detached from the work that made it.
OWN-WORLD: Near-black green-cast ground; mint the only accent, rose for outflow, amber for unfinished
business; hairline plates, Geist tabular numerals, 10px tracked uppercase eyelines. Account identity is a
step on the mint ramp, never a new hue.
STORY: A freelancer between Berlin and Dubai reads their position in either currency, sees which project
earned it, and clears the transactions that arrived without a home.
FIRST VIEWPORT: Full-width flow bar — income above the axis in mint, spending below in rose, net resolved
at the right beside the EUR/AED switch and the rate's stated provenance. Beneath it the accounts board;
to its right the unattributed queue as cards with open edges.
FORM: Accounts board, candidate 7 of 7 on the grounded list, seed 47c3a9a8.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-void text-ink">
        <div hidden dangerouslySetInnerHTML={{ __html: CONTRACT }} />
        <CurrencyProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <MobileTop />
              <main className="min-w-0 flex-1 pb-[76px] lg:pb-0">{children}</main>
            </div>
          </div>
          <MobileBar />
        </CurrencyProvider>
      </body>
    </html>
  );
}
