import { buttonVariants } from "@/components/ui/button";
import { useCommonRedirects as useRoleGuard } from "@/hooks/use-common-redirects";
import { getVMPSession } from "@/lib/auth";
import { ROUTES } from "@/lib/const";
import { RoleNotImplementedError, cn } from "@/lib/utils";
import { capitalize } from "@/lib/utils";
import { HeartHandshake, ShoppingCart } from "lucide-react";
import { RedirectType } from "next/dist/client/components/redirect";
import Link from "next/link";
import { redirect } from "next/navigation";
import { match } from "ts-pattern";

function CardLink({ type }: { type: "client" | "vendor" }) {
  const url =
    type === "client" ? "/register?role=client" : "/register?role=vendor";

  const Icon = type === "client" ? ShoppingCart : HeartHandshake;

  const txt =
    type === "client"
      ? "Recipient of goods or services"
      : "Supplier of goods or services ";

  return (
    <Link
      className={cn(
        buttonVariants({ variant: "subtle" }),
        "disabled flex h-[300px] w-[300px] flex-col gap-4",
      )}
      href={url}
    >
      <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">
        {capitalize(type)}
      </h1>
      <h2>{txt}</h2>
      <Icon className="h-8 w-8" />
    </Link>
  );
}

async function Page() {
  let session = await getVMPSession();

  session = useRoleGuard(session);

  return match(session.user.role)
    .with("NONE", () => (
      <div className="flex flex-col items-center justify-center gap-8 py-8 sm:flex-row">
        <CardLink type="client" />
        <CardLink type="vendor" />
      </div>
    ))
    .with("CLIENT", () => redirect(ROUTES.CUSTOMER.POSTINGS))
    .otherwise((r) => {
      throw new RoleNotImplementedError(r);
    });
}

export default Page;
