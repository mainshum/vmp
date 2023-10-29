import { db } from "@/lib/db";
import { getVMPSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/const";
import { RequestsTable } from "./request-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { RequestForm } from "@/components/create-request";
import { buttonVariants } from "@/components/ui/button";
import { Shell } from "@/components/shell";

const getRequests = () =>
  db.request.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      creationDate: true,
      validUntil: true,
    },
  });

async function PageServer() {
  const session = await getVMPSession();
  if (!session) return redirect(ROUTES.SIGIN);

  const requests = await getRequests();

  return (
    <Shell className="py-8">
      <section className="flex flex-col">
        <RequestForm />
        <RequestsTable requests={requests} />
      </section>
    </Shell>
  );
}

export default PageServer;
