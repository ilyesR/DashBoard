import { CurrencySwitch } from "@/components/ledger/ledger";
import { EarnedSplit } from "@/components/projects/earned-split";
import { ProjectsTable } from "@/components/projects/projects-table";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Projects — Meridian" };

export default function ProjectsPage() {
  return (
    <>
      <PageHeader title="Projects" meta={<>The work, and what each piece of it has earned</>}>
        <CurrencySwitch />
      </PageHeader>
      {/* The table needs its full width before the rail may sit beside it;
          below this the rail drops underneath rather than crushing the rows. */}
      <div className="grid gap-5 p-4 sm:p-5 min-[1660px]:grid-cols-[minmax(0,1fr)_300px] xl:p-7">
        <ProjectsTable />
        <EarnedSplit />
      </div>
    </>
  );
}
