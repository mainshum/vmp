import Postings from "@/components/postings";
import { Button } from "@/components/ui/Button";
import { getBaseUrl } from "@/lib/utils";
import { headers } from "next/headers";

async function PageServer() {
  const res = await fetch(`${getBaseUrl()}/api/postings`, {
    headers: headers(),
  });

  const data = await res.json();

  return (
    <>
      <section className="flex items-center justify-between py-8">
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">
          Postings
        </h1>
        <Button>Add new</Button>
      </section>
      <section>
        <Postings postings={data} />
      </section>
    </>
  );
}

export default PageServer;
