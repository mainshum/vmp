import { RequestForm } from "@/app/customer/requests/create/request-form";
import { appRouter, createContext } from "@/server/trpc-server";

async function RequestCreate({
  searchParams,
}: {
  searchParams: { requestId: string };
}) {
  if (!searchParams.requestId) return <RequestForm initRequest={null} />;

  const caller = appRouter.createCaller(await createContext());
  const data = await caller.request({ requestId: searchParams.requestId });

  return <RequestForm initRequest={data} />;
}

export default RequestCreate;
