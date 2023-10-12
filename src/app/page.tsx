import { getVMPSession } from "@/lib/auth";
import { ROUTES } from "@/lib/const";
import { redirect } from "next/navigation";
import { match } from "ts-pattern";

export default async function Home() {
  const session = await getVMPSession();

  if (!session) return redirect(ROUTES.SIGIN);

  return (
    match(session.user.role)
      // in the future we're likely to have some kind of home page,
      // for the time being go to postings
      .with("CLIENT", () => redirect(ROUTES.CUSTOMER.POSTINGS))
      .with("NONE", () => redirect(ROUTES.ROLE_SELECT))
      .otherwise((r) => {
        throw Error(`${r} not implemented`);
      })
  );
}
