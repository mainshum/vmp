import { TRPCError, initTRPC } from "@trpc/server";
import { db } from "@/lib/db";
import { RequestPreview } from "@/types/request";
import {
  OfferInput,
  RequestInput,
  nanoidGenerated,
  requestId,
} from "@/lib/validation";
import { z } from "zod";
import { VMPRole } from "@prisma/client";
import superjson from "superjson";
import { NextSession, getVMPSession } from "@/lib/auth";
import { adminOr } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const createContext = async (session?: NextSession) => {
  return { session: session || (await getVMPSession()) };
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

const customerRouter = t.router({
  requests: roleProtected(adminOr(VMPRole.CLIENT)).query(
    ({ ctx: { user } }) => {
      return db.request.findMany({ where: { userId: user.id } });
    },
  ),
  requestsPreviews: t.procedure.query(() => {
    return db.$queryRaw<RequestPreview[]>`
      select req.id, req.status, req.name, CAST(req."validUntil" as TEXT), CAST(req."creationDate" as TEXT), CAST(COUNT(ofe.id) as INT) as "offersCount"
      from "Request" req
      left join "Offer" ofe 
      on req.id = ofe."requestId"
      group by req.id
  `;
  }),
  request: t.procedure.input(requestId).query(({ input }) => {
    return db.request.findFirst({ where: { id: input } });
  }),
  requestDelete: t.procedure.input(z.string()).mutation(({ input: id }) => {
    return db.request.delete({ where: { id } });
  }),
  offers: t.procedure.input(requestId).query(({ input }) => {
    return db.offer.findMany({
      where: { requestId: input },
      orderBy: { id: "asc" },
    });
  }),
  upsertRequest: roleProtected((r) => r === "ADMIN" || r === "CLIENT")
    .input(
      z.object({ requestPostModel: RequestInput, id: z.string().optional() }),
    )
    .mutation(({ input, ctx: { user } }) => {
      const { requestPostModel, id } = input;

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
});

const offer = roleProtected(adminOr(VMPRole.VENDOR))
  .input(nanoidGenerated)
  .query(({ input }) => {
    return db.offer.findFirstOrThrow({ where: { id: input } });
  });

const vendorRouter = t.router({
  offer: offer,
  requests: roleProtected(adminOr(VMPRole.VENDOR)).query(() => {
    return db.request.findMany({
      select: {
        id: true,
        name: true,
        validUntil: true,
        creationDate: true,
      },
    });
  }),
  insertOffer: roleProtected((r) => r === "ADMIN" || r === "VENDOR")
    .input(OfferInput)
    .mutation(({ input, ctx: { user } }) => {
      return db.offer.create({
        data: {
          ...input,
          userId: user.id,
          validUntil: new Date(),
          creationDate: new Date(),
        },
      });
    }),
  updateOffer: roleProtected((r) => r === "ADMIN" || r === "VENDOR")
    .input(OfferInput.partial({ cv: true }))
    .mutation(async ({ input, ctx }) => {
      revalidatePath("/");
      return db.offer.update({
        where: { id: input.id },
        data: input,
      });
    }),
});

const adminRouter = t.router({
  requests: roleProtected(adminOr()).query(() => {
    return db.request.findMany();
  }),
});

// this is our RPC API
export const appRouter = t.router({
  [VMPRole.CLIENT]: customerRouter,
  [VMPRole.VENDOR]: vendorRouter,
  [VMPRole.ADMIN]: adminRouter,
});

export type AppRouter = typeof appRouter;
