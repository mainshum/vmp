import { appRouter, createContext } from "@/server/trpc-server";
import { JobProfileForm } from "./offer-form";
import { getVMPSession } from "@/lib/auth";

async function OfferCreate({
  searchParams,
}: {
  searchParams: { requestId: string };
}) {
  if (!searchParams.requestId) throw new Error("Request id is required");

  const session = await getVMPSession();

  const caller = appRouter.createCaller(await createContext(session));

  const data = await caller.CLIENT.request(searchParams.requestId);

  if (!data) throw new Error("Request not found");

  return <JobProfileForm requestId={data.id} requestName={data.name} />;
}

export default OfferCreate;
