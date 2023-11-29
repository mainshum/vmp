import { RequestsTable } from "./request-table";

import { Shell } from "@/components/shell";
import { getBaseUrl } from "@/lib/utils";
import { Request } from "@prisma/client";

async function PageServer() {
  const requests = (await (
    await fetch(`${getBaseUrl()}/api/requests`, { cache: "force-cache" })
  ).json()) as Request[];

  return (
    <Shell className="py-8">
      <section className="flex flex-col">
        <RequestsTable requests={requests} />
      </section>
    </Shell>
  );
}

export default PageServer;
