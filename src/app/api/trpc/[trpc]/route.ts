import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc-server";
import { getSession } from "next-auth/react";
import { getVMPSession } from "@/lib/auth";

// this is the server RPC API handler

const handler = async (request: Request) => {
  const session = await getVMPSession();

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: function () {
      return { session };
    },
  });
};

export const GET = handler;
export const POST = handler;
