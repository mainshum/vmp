import { initTRPC } from "@trpc/server";
import { db } from "@/lib/db";
import { RequestPreview } from "@/types/request";
import { z } from "zod";

const t = initTRPC.create();

// this is our data store, used to respond to incoming RPCs from the client

const requestId = z.object({ requestId: z.string() });

// this is our RPC API
export const appRouter = t.router({
  // requests
  requests: t.procedure.query(() => {
    return db.request.findMany({});
  }),
  requestsPreviews: t.procedure.query(() => {
    return db.$queryRaw<RequestPreview[]>`
      select req.id, req.status, req.name, CAST(req."validUntil" as TEXT), CAST(req."creationDate" as TEXT), CAST(COUNT(ofe.id) as INT) as "offersCount"
      from "Request" req
      left join "Offer" ofe 
      on req.id = ofe."requestId"
      group by req.id
  `;
  }),
  requestDelete: t.procedure.input(z.string()).mutation(({ input: id }) => {
    return db.request.delete({ where: { id } });
  }),
  offers: t.procedure.input(requestId).query(({ input }) => {
    return db.offer.findMany({
      where: { requestId: input.requestId },
      orderBy: { id: "asc" },
    });
  }),
});

export type AppRouter = typeof appRouter;
