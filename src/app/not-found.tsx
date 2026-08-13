import Link from "next/link";
import { IconArrow } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="eyeline">404</div>
      <h1 className="mt-3 text-[22px] font-semibold tracking-[-0.02em]">
        No account, movement or page here
      </h1>
      <p className="mt-2 max-w-[46ch] text-[13px] leading-[1.6] text-muted">
        The address does not match anything on the board. If you followed a link to a project, it may
        have been closed and removed.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-mint px-3.5 py-2 text-[12.5px] font-semibold text-[#04150E] transition-colors hover:bg-mint-1"
      >
        Back to the board
        <IconArrow size={15} />
      </Link>
    </div>
  );
}
