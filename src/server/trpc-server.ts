import { initTRPC } from "@trpc/server";
import { db } from "@/lib/db";
import { RequestPreview } from "@/types/request";

const t = initTRPC.create();

// this is our data store, used to respond to incoming RPCs from the client

// this is our RPC API
export const appRouter = t.router({
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
});

export type AppRouter = typeof appRouter;
