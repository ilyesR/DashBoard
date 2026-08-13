import { RateEditor } from "@/components/settings/rate-editor";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Currency & rate — Meridian" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Currency & rate"
        meta={<>What the totals are counted in, and on what assumption</>}
      />
      <div className="max-w-[880px] p-4 sm:p-5 xl:p-7">
        <RateEditor />
      </div>
    </>
  );
}
