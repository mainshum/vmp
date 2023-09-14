import { Button } from "@/components/ui/Button";
import { getBaseUrl } from "@/lib/utils";
import { PageParams } from "@/types/next";

async function PageServer({ searchParams }: PageParams) {
  const url = new URL(`${getBaseUrl()}/api/postings`);

  if (searchParams["mockstate"])
    url.searchParams.set("mockstate", searchParams["mockstate"] as string);

  return (
    <>
      <section className="flex items-center justify-between py-8">
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">
          Postings will go here
        </h1>
        <Button>Add new</Button>
      </section>
      <section></section>
    </>
  );
}

export default PageServer;
