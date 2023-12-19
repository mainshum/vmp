import { appRouter } from "@/server/trpc-server";
import { RequestsTable } from "./request-table";

async function PageServer() {
  const caller = appRouter.createCaller({});

  const data = await caller.requests();

  return (
    <section className="flex flex-col">
      <RequestsTable requests={data} />
    </section>
  );
}

export default PageServer;
