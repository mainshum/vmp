import { Nullalble } from "@/types/shared";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export function useCommonRedirects(session: Nullalble<Session>) {
  if (session == null) redirect("/sign-in");
  if (session.user.role !== "none") redirect("/postings");
}
