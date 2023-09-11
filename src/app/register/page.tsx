import { RegisterForm } from "@/components/register";
import { useCommonRedirects } from "@/hooks/use-common-redirects";
import { nextAuthOptions } from "@/lib/auth";
import { ROUTES } from "@/lib/const";
import { PageParams } from "@/types/next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

function VendorRegister() {
  return (
    <div className="center-absolute">
      <h1>Vendor registration not implemented</h1>
    </div>
  );
}

async function Page({ searchParams }: PageParams) {
  const mSession = await getServerSession(nextAuthOptions);

  // TODO proper redirects structure
  const session = useCommonRedirects(mSession);

  if (session.user.role !== "NONE") redirect(ROUTES.CLIENT.POSTINGS);

  if (searchParams["type"] === "vendor") return <VendorRegister />;

  return (
    <div className="py-8">
      <RegisterForm />
    </div>
  );
}

export default Page;
