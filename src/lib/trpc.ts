import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/trpc-server";
export const trpc = createTRPCReact<AppRouter>();
