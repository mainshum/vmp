import { useCommonRedirects } from "@/hooks/use-common-redirects";
import { nextAuthOptions } from "@/lib/auth";
import { PageParams } from "@/types/next";
import { getServerSession } from "next-auth";

async function Page(searchParams: PageParams) {
  const session = await getServerSession(nextAuthOptions);
  useCommonRedirects(session);
  return <div>Register page</div>;
}

export default Page;
