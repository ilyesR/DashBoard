import { notFound } from "next/navigation";
import { ACCOUNTS, SELF_ACCOUNT_ID, accountById } from "@/lib/data";
import { CurrencySwitch } from "@/components/ledger/ledger";
import { ProjectDetail } from "@/components/projects/project-detail";
import { PageHeader } from "@/components/ui";

export function generateStaticParams() {
  return ACCOUNTS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const account = accountById(id);
  return { title: account ? `${account.client} — Meridian` : "Not found — Meridian" };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const account = accountById(id);
  if (!account) notFound();

  return (
    <>
      <PageHeader
        title={account.id === SELF_ACCOUNT_ID ? "Personal" : account.client}
        meta={
          <>
            {account.name} · {account.place}
          </>
        }
      >
        <CurrencySwitch />
      </PageHeader>
      <ProjectDetail account={account} />
    </>
  );
}
