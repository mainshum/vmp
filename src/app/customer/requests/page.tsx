import { RequestsTable } from "./request-table";

import { db } from "@/lib/db";

async function PageServer() {
  const data = await db.request.findMany();

  return (
    <section className="flex flex-col">
      <RequestsTable requests={data} />
    </section>
  );
}

export default PageServer;
