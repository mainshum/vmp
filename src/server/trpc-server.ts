import { initTRPC } from "@trpc/server";
import { db } from "@/lib/db";
import { RequestPreview } from "@/types/request";
import { RequestInput } from "@/lib/validation";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import superjson from "superjson";

const t = initTRPC.create({
  transformer: superjson,
});

const requestId = z.object({ requestId: z.string().cuid() });

// this is our RPC API
export const appRouter = t.router({
  // requests
  requests: t.procedure.query(() => {
    return db.request.findMany({});
  }),
  request: t.procedure.input(requestId).query(({ input }) => {
    return db.request.findFirst({ where: { id: input.requestId } });
  }),
  upsertRequest: t.procedure
    .input(
      z.object({
        requestPostModel: RequestInput,
        id: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const { requestPostModel, id } = input;
      const data = {
        ...requestPostModel,
        technical: !requestPostModel.technical
          ? Prisma.DbNull
          : requestPostModel.technical,
      };

      if (id) return db.request.update({ where: { id }, data });

      return db.request.create({
        data: { ...data, creationDate: new Date(), validUntil: new Date() },
      });
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
