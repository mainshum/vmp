import { appRouter, createContext } from "@/server/trpc-server";
import { JobProfileForm } from "./offer-form";
import { getVMPSession } from "@/lib/auth";
import { z } from "zod";
import { VMPRole } from "@prisma/client";

const metaSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("CREATE"), requestId: z.string() }),
  z.object({ type: z.literal("EDIT"), offerId: z.string() }),
]);

const rolesAllowed: string[] = [VMPRole.ADMIN, VMPRole.VENDOR];

async function OfferCreate({
  searchParams,
}: {
  searchParams: { meta?: string };
}) {
  if (!searchParams.meta) throw new Error("Meta search param is required");

  const meta = metaSchema.safeParse(
    JSON.parse(decodeURIComponent(searchParams.meta)),
  );

  if (!meta.success) throw new Error("Invalid meta search param");

  const session = await getVMPSession();

  if (!session || !rolesAllowed.includes(session.user.role))
    throw new Error("User not found");

  if (meta.data.type === "CREATE") {
    return <JobProfileForm requestId={meta.data.requestId} />;
  }

  const caller = appRouter.createCaller(await createContext(session));

  const offer = await caller.VENDOR.offer(meta.data.offerId);

  return <JobProfileForm offer={offer} requestId={offer.requestId} />;
}

export default OfferCreate;
