import { getBaseUrl } from "@/lib/utils";
import { PageParams } from "@/types/next";
import { DataTable, OpsTable } from "./data-table";
import { columns } from "./columns";
import { db } from "@/lib/db";

const getPostings = () => {
  return db.opportunity.findMany({ include: { offers: true } });
};

async function PageServer({ searchParams }: PageParams) {
  const url = new URL(`${getBaseUrl()}/api/postings`);

  if (searchParams["mockstate"])
    url.searchParams.set("mockstate", searchParams["mockstate"] as string);

  return (
    <section className="flex flex-col py-8">
      <OpsTable data={await getPostings()} />
    </section>
  );
}

export default PageServer;
