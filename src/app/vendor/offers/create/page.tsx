import { appRouter } from "@/server/trpc-server";
import { JobProfileForm } from "./offer-form";

async function OfferCreate({
  searchParams,
}: {
  searchParams: { requestId: string };
}) {
  if (!searchParams.requestId) throw new Error("Request id is required");

  const caller = appRouter.createCaller({});
  const data = await caller.request({ requestId: searchParams.requestId });

  if (!data) throw new Error("Request not found");

  return <JobProfileForm />;
}

export default OfferCreate;
