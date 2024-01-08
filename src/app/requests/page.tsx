import { appRouter, createContext } from "@/server/trpc-server";
import { Customer, Vendor, Admin } from "./request-table";
import { match } from "ts-pattern";
import { getVMPSession } from "@/lib/auth";

async function PageServer() {
  const session = await getVMPSession();

  if (!session || session.user.role === "NONE") return <div>Not logged in</div>;

  const caller = appRouter.createCaller(await createContext(session));

  if (session.user.role === "VENDOR")
    return <Vendor requests={await caller.request.vendorList()} />;

  if (session.user.role === "CLIENT")
    return <Customer requests={await caller.request.list()} />;

  return <Admin requests={await caller.request.list()} />;
}

export default PageServer;
