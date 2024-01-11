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
import { RequestStatus, VMPRole } from "@prisma/client";
import superjson from "superjson";
import { NextSession, getVMPSession } from "@/lib/auth";
import { adminOr } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { match } from "ts-pattern";

export const createContext = async (session?: NextSession) => {
  return { session: session || (await getVMPSession()) };
};

const t = initTRPC
  .context<typeof createContext>()
  .create({ transformer: superjson });

// eslint-disable-next-line no-unused-vars
const roleProtected = <T extends VMPRole[]>(allowedRoles: T) =>
  t.procedure.use(async function isAuthed(opts) {
    const user = opts.ctx.session?.user;

    if (!user || !allowedRoles.includes(user.role)) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return opts.next({
      ctx: {
        ...opts.ctx,
        user: {
          ...user,
          role: user.role as T[number],
        },
      },
    });
  });

const customerRouter = t.router({
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
      include: { offerGrade: true },
    });
  }),
  upsertRequest: roleProtected(["ADMIN", "CLIENT"])
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

const offer = roleProtected(["ADMIN", "VENDOR"])
  .input(nanoidGenerated)
  .query(({ input }) => {
    return db.offer.findFirstOrThrow({ where: { id: input } });
  });

const vendorRouter = t.router({
  offer: offer,
  insertOffer: roleProtected(["ADMIN", "VENDOR"])
    .input(OfferInput)
    .mutation(async ({ input, ctx: { user } }) => {
      const offerGrade = await db.offerGrade.create({ data: {} });

      return db.offer.create({
        data: {
          ...input,
          userId: user.id,
          offerGradeId: offerGrade.id,
          validUntil: new Date(),
          creationDate: new Date(),
        },
      });
    }),
  updateOffer: roleProtected(["VENDOR"])
    .input(OfferInput.partial({ cv: true }))
    .mutation(async ({ input, ctx }) => {
      revalidatePath("/");
      return db.offer.update({
        where: { id: input.id },
        data: input,
      });
    }),
});

const offerRouter = t.router({
  offerId: roleProtected(["ADMIN"])
    .input(z.string())
    .query(({ input }) => {
      return db.offer.findFirst({ where: { id: input } });
    }),
});

const requestRouter = t.router({
  vendorList: roleProtected(["VENDOR"]).query(() => {
    return db.request.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        _count: { select: { offers: true } },
      },
    });
  }),
  list: roleProtected(["CLIENT", "ADMIN"]).query(({ ctx: { user } }) => {
    return match(user.role)
      .with("ADMIN", () =>
        db.request.findMany({
          include: {
            _count: { select: { offers: true } },
          },
        }),
      )
      .with("CLIENT", () =>
        db.request.findMany({
          where: { userId: user.id },

          include: {
            _count: { select: { offers: true } },
          },
        }),
      )
      .exhaustive();
  }),
  byId: roleProtected(["CLIENT", "ADMIN"])
    .input(requestId)
    .query(({ input, ctx: { user } }) => {
      return match(user.role)
        .with("ADMIN", () => db.request.findFirst({ where: { id: input } }))
        .with("CLIENT", () =>
          db.request.findFirst({ where: { userId: user.id, id: input } }),
        )
        .exhaustive();
    }),
  updateStatus: roleProtected(["ADMIN"])
    .input(z.object({ id: requestId, newStatus: z.nativeEnum(RequestStatus) }))
    .mutation(({ input }) => {
      return db.request.update({
        where: { id: input.id },
        data: { status: input.newStatus },
      });
    }),
});

// this is our RPC API
export const appRouter = t.router({
  [VMPRole.CLIENT]: customerRouter,
  [VMPRole.VENDOR]: vendorRouter,
  request: requestRouter,
  offer: offerRouter,
});

export type AppRouter = typeof appRouter;
