import { db } from "@/lib/db";
import { getVMPSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/const";
import { RequestsTable } from "./request-table";

const getRequests = () => db.opportunity.findMany();

async function PageServer() {
  const session = await getVMPSession();
  if (!session) return redirect(ROUTES.SIGIN);

  const requests = await getRequests();

  return (
    <section className="flex flex-col py-8">
      <RequestsTable requests={requests} />
    </section>
  );
}

export default PageServer;
