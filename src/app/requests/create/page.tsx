import { RequestForm } from "@/app/requests/create/request-form";
import { getVMPSession } from "@/lib/auth";
import { adminOr } from "@/lib/utils";
import { appRouter, createContext } from "@/server/trpc-server";
import { VMPRole } from "@prisma/client";

async function RequestCreate({
  searchParams,
}: {
  searchParams: { requestId: string };
}) {
  const session = await getVMPSession();

  if (!session || !adminOr(VMPRole.CLIENT)(session.user.role)) {
    return <div>Only admins and customers can create requests</div>;
  }

  if (!searchParams.requestId) return <RequestForm initRequest={null} />;

  const caller = appRouter.createCaller(await createContext(session));

  const data = await caller.CLIENT.request(searchParams.requestId);

  return <RequestForm initRequest={data} />;
}

export default RequestCreate;
