import { appRouter, createContext } from "@/server/trpc-server";
import { Customer, Vendor, Admin } from "./request-table";
import { match } from "ts-pattern";
import { getVMPSession } from "@/lib/auth";

async function PageServer() {
  const session = await getVMPSession();

  if (!session || session.user.role === "NONE") {
    return <div>Not logged in</div>;
  }

  const caller = appRouter.createCaller(await createContext(session));

  return (
    <>
      {await match(session.user.role)
        .with("CLIENT", async () => {
          return <Customer requests={await caller.CLIENT.requests()} />;
        })
        .with("VENDOR", async () => {
          return <Vendor requests={await caller.VENDOR.requests()} />;
        })
        .with("ADMIN", async () => {
          return <Admin requests={await caller.ADMIN.requests()} />;
        })
        .exhaustive()}
    </>
  );
}

export default PageServer;
