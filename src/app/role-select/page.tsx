import { buttonVariants } from "@/components/ui/Button";
import { useCommonRedirects } from "@/hooks/use-common-redirects";
import { nextAuthOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { capitalize } from "@/lib/utils";
import { HeartHandshake, ShoppingCart } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

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
  const session = await getServerSession(nextAuthOptions);

  useCommonRedirects(session);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8 sm:flex-row">
      <CardLink type="client" />
      <CardLink type="vendor" />
    </div>
  );
}

export default Page;
