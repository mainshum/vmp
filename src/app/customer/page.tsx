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
    <section className="flex flex-col py-8">
      <Dialog>
        <DialogTrigger className={buttonVariants()}>
          Create new request
        </DialogTrigger>
        <DialogContent className="max-h-full overflow-y-auto sm:max-h-[75%]">
          <DialogHeader>
            <DialogTitle className="pb-4">Job request</DialogTitle>
            <DialogDescription>
              <RequestForm />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <RequestsTable requests={requests} />
    </section>
  );
}

export default PageServer;
