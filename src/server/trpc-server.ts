import { initTRPC } from "@trpc/server";
import { db } from "@/lib/db";

const t = initTRPC.create();

// this is our data store, used to respond to incoming RPCs from the client

// this is our RPC API
export const appRouter = t.router({
  requests: t.procedure.query(() => {
    return db.request.findMany({});
  }),
});

export type AppRouter = typeof appRouter;
