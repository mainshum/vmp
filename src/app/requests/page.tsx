import { appRouter, createContext } from "@/server/trpc-server";
import { Customer, Vendor, Admin } from "../customer/requests/request-table";
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
          const data = await caller.CLIENT.requests();
          return <Customer requests={data} />;
        })
        .with("VENDOR", () => {
          //   const data = await caller.VENDOR.requests();
          return <Vendor requests={[]} />;
        })
        .with("ADMIN", async () => {
          return <Admin requests={await caller.ADMIN.requests()} />;
        })
        .exhaustive()}
    </>
  );
}

export default PageServer;
