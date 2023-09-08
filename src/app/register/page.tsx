import { RegisterForm } from "@/components/register";
import { useCommonRedirects } from "@/hooks/use-common-redirects";
import { nextAuthOptions } from "@/lib/auth";
import { PageParams } from "@/types/next";
import { getServerSession } from "next-auth";

function VendorRegister() {
  return (
    <div className="center-absolute">
      <h1>Vendor registration not implemented</h1>
    </div>
  );
}

async function Page({ searchParams }: PageParams) {
  const mSession = await getServerSession(nextAuthOptions);
  const session = useCommonRedirects(mSession);

  if (searchParams["role"] === "vendor") return <VendorRegister />;

  return (
    <div className="py-8">
      <RegisterForm />
    </div>
  );
}

export default Page;
