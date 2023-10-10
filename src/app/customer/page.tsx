import { getBaseUrl } from "@/lib/utils";
import { PageParams } from "@/types/next";
import { Opportunity } from "../../../prisma/generated/zod";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { db } from "@/lib/db";

const getPostings = (): Promise<Opportunity[]> => {
  return db.opportunity.findMany({});
};

async function PageServer({ searchParams }: PageParams) {
  const url = new URL(`${getBaseUrl()}/api/postings`);

  if (searchParams["mockstate"])
    url.searchParams.set("mockstate", searchParams["mockstate"] as string);

  return (
    <section className="flex flex-col py-8">
      <DataTable columns={columns} data={await getPostings()} />
    </section>
  );
}

export default PageServer;
