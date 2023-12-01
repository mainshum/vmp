import { RequestsTable } from "./request-table";

import { Shell } from "@/components/shell";
import { getBaseUrl } from "@/lib/utils";
import { Request } from "@prisma/client";

async function PageServer() {
  const requests = (await (
    await fetch(`${getBaseUrl()}/api/requests`)
  ).json()) as Request[];

  return (
    <section className="flex flex-col">
      <RequestsTable requests={requests} />
    </section>
  );
}

export default PageServer;
