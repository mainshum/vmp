import Postings from "@/components/postings";
import { Button } from "@/components/ui/Button";
import { nextAuthOptions } from "@/lib/auth";
import { getBaseUrl } from "@/lib/utils";
import { PageParams } from "@/types/next";
import { getServerSession } from "next-auth";

async function PageServer({ searchParams }: PageParams) {
  const url = new URL(`${getBaseUrl()}/api/postings`);

  if (searchParams["mockstate"])
    url.searchParams.set("mockstate", searchParams["mockstate"] as string);

  const res = await fetch(url.toString());
  const session = await getServerSession(nextAuthOptions);

  const data = await res.json();

  return (
    <>
      <section className="flex items-center justify-between py-8">
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">
          Postings for {session?.user?.email}
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
