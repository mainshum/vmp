import { ROUTES } from "@/lib/const";
import { Nullalble } from "@/types/shared";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export function useCommonRedirects(session: Nullalble<Session>): Session {
  if (session == null) redirect(ROUTES.SIGIN);

  return session;
}
