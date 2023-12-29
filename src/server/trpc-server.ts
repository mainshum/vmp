import { TRPCError, initTRPC } from "@trpc/server";
import { db } from "@/lib/db";
import { RequestPreview } from "@/types/request";
import { RequestInput } from "@/lib/validation";
import { z } from "zod";
import { VMPRole } from "@prisma/client";
import superjson from "superjson";
import { getVMPSession } from "@/lib/auth";
import { match } from "ts-pattern";

import { createHTTPHandler } from "@trpc/server/adapters/standalone";

export const createContext = async () => {
  const session = await getVMPSession();

  return { session };
};

const t = initTRPC
  .context<typeof createContext>()
  .create({ transformer: superjson });

// eslint-disable-next-line no-unused-vars
const roleProtected = (authed: (r: VMPRole) => boolean) =>
  t.procedure.use(async function isAuthed(opts) {
    const user = opts.ctx.session?.user;

    if (!user || !authed(user.role)) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return opts.next({
      ctx: { ...opts.ctx, user },
    });
  });

const requestId = z.object({ requestId: z.string().cuid() });

// this is our RPC API
export const appRouter = t.router({
  // requests
  requests: roleProtected((r) => r !== "NONE").query(({ ctx: { user } }) => {
    const { role } = user;

    return match(role)
      .with(VMPRole.CLIENT, () =>
        db.request.findMany({ where: { userId: user.id } }),
      )
      .with(VMPRole.VENDOR, () =>
        db.request.findMany({
          select: {
            name: true,
            id: true,
            creationDate: true,
            validUntil: true,
          },
        }),
      )
      .with(VMPRole.ADMIN, () => db.request.findMany())
      .with(VMPRole.NONE, () => {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      })
      .exhaustive();
  }),
  request: t.procedure.input(requestId).query(({ input }) => {
    return db.request.findFirst({ where: { id: input.requestId } });
  }),
  upsertRequest: roleProtected((r) => r === "ADMIN" || r === "CLIENT")
    .input(
      z.object({ requestPostModel: RequestInput, id: z.string().optional() }),
    )
    .mutation(({ input, ctx: { user } }) => {
      const { requestPostModel, id } = input;

      console.log(requestPostModel);

      if (id)
        return db.request.update({ where: { id }, data: requestPostModel });

      return db.request.create({
        data: {
          ...requestPostModel,
          userId: user.id,
          creationDate: new Date(),
          validUntil: new Date(),
        },
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
