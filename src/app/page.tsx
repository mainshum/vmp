import { nextAuthOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(nextAuthOptions);

  if (!session) throw Error("impossible state");

  redirect("/client");
}
