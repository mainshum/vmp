import { TRPCError, initTRPC } from "@trpc/server";
import { db } from "@/lib/db";
import { RequestPreview } from "@/types/request";
import {
  OfferInput,
  RequestInput,
  nanoidGenerated,
  cuid,
  SetStarsInput,
  emailValidator,
  stringMin3,
  CreateUser,
} from "@/lib/validation";
import { z } from "zod";
import { RequestStatus, VMPRole, OfferGrade } from "@prisma/client";
import superjson from "superjson";
import { NextSession, getVMPSession } from "@/lib/auth";
import { adminOr, delay } from "@/lib/utils";
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
  request: t.procedure.input(cuid).query(({ input }) => {
    return db.request.findFirst({ where: { id: input } });
  }),
  requestDelete: t.procedure.input(z.string()).mutation(({ input: id }) => {
    return db.request.delete({ where: { id } });
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
  offers: t.procedure.input(cuid).query(({ input }) => {
    return db.offer.findMany({
      where: { requestId: input },
      orderBy: { id: "asc" },
      include: { offerGrade: true },
    });
  }),
  offerId: roleProtected(["ADMIN"])
    .input(z.string())
    .query(({ input }) => {
      return db.offer.findFirst({
        where: { id: input },
        include: { offerGrade: true },
      });
    }),
  offerGrade: roleProtected(["ADMIN"])
    .input(z.string())
    .query(({ input }) => {
      return db.offerGrade.findFirst({ where: { id: input } });
    }),
  setStars: roleProtected(["ADMIN"])
    .input(SetStarsInput)
    .mutation(async ({ input }) => {
      return db.offerGrade.update({
        where: { id: input.offerGradeId },
        data: { [input.starType]: input.stars },
        include: { offer: { select: { id: true } } },
      });
    }),
});

const usersRouter = t.router({
  createCustomer: t.procedure.input(CreateUser).mutation(async ({ input }) => {
    const user = await db.user.findFirst({ where: { email: input.email } });
    if (user)
      throw new TRPCError({
        code: "UNPROCESSABLE_CONTENT",
        cause: "EMAIL",
      });
    return db.user.create({
      data: input,
    });
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
    .input(cuid)
    .query(({ input, ctx: { user } }) => {
      return match(user.role)
        .with("ADMIN", () => db.request.findFirst({ where: { id: input } }))
        .with("CLIENT", () =>
          db.request.findFirst({ where: { userId: user.id, id: input } }),
        )
        .exhaustive();
    }),
  updateStatus: roleProtected(["ADMIN"])
    .input(z.object({ id: cuid, newStatus: z.nativeEnum(RequestStatus) }))
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
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
