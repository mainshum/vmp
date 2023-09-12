import DemoForm from "@/components/demo-form";
import { getVMPSession } from "@/lib/auth";
import { ROUTES } from "@/lib/const";
import { db } from "@/lib/db";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
// import DemoForm from "@/components/demo-form";

const wrapGetSession = async (): Promise<Session> => {
  const session = await getVMPSession();

  if (!session) redirect(ROUTES.SIGIN);

  return session;
};

const getSettings = async (session: Session) => {
  return await db.customer.findFirstOrThrow({
    where: { id: session.user.id },
  });
};

async function Page() {
  const data = await getSettings(await wrapGetSession());

  return <DemoForm data={data} />;
}

export default Page;
