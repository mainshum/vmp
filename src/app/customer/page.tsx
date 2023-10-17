import { db } from "@/lib/db";
import { getVMPSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/const";
import { OpportunityTable } from "./columns";

const getOffers = () => {
  return db.opportunity.findMany({ include: { offers: true } });
};

async function PageServer() {
  const session = await getVMPSession();
  if (!session) return redirect(ROUTES.SIGIN);

  const postings = await getOffers();

  return (
    <section className="flex flex-col py-8">
      <OpportunityTable data={postings} />
    </section>
  );
}

export default PageServer;
