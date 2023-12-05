import { RequestsTable } from "./request-table";

import { RequestClient } from "@/lib/data";

async function PageServer() {
  const requests = await RequestClient.getAll();

  return (
    <section className="flex flex-col">
      <RequestsTable requests={requests} />
    </section>
  );
}

export default PageServer;
