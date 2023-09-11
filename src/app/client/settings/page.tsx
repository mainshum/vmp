import { getVMPSession } from "@/lib/auth";
import { ROUTES } from "@/lib/const";
import { db } from "@/lib/db";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

const wrapGetSession = async (): Promise<Session> => {
  const session = await getVMPSession();

  if (!session) redirect(ROUTES.SIGIN);

  return session;
};

const getSettings = async (session: Session) => {
  const data = await db.customer.findFirst({
    where: { id: session.user.id },
  });

  return data;
};

async function Page() {
  const data = await getSettings(await wrapGetSession());

  return (
    <div>
      <div>
        <span>Server</span>
        <span>{JSON.stringify(data, null, 2)}</span>
      </div>
    </div>
  );
}

export default Page;
