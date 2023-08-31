import Icons from "@/components/icons";
import { buttonVariants } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { nextAuthOptions } from "@/lib/auth";
import { ROUTES } from "@/lib/const";
import { cn } from "@/lib/utils";
import { PageParams } from "@/types/next";
import { capitalize } from "@/lib/utils";
import { HeartHandshake, ShoppingCart } from "lucide-react";
import { Session, getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

function useUserRedirects(s: Session | null) {
  if (s == null) redirect(ROUTES.SIGIN);
}

function CardLink({ type }: { type: "client" | "vendor" }) {
  const url = type === "client" ? "/client/postings" : "/vendor/postings";

  const Icon = type === "client" ? ShoppingCart : HeartHandshake;

  return (
    <Link
      className={cn(
        buttonVariants({ variant: "subtle" }),
        "flex h-[200px] w-[200px] flex-col gap-4",
      )}
      href={url}
    >
      <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">
        {capitalize(type)}
      </h1>
      <Icon className="h-8 w-8" />
    </Link>
  );
}

async function Page(searchParams: PageParams) {
  const session = await getServerSession(nextAuthOptions);

  useUserRedirects(session);

  return (
    <div className="flex flex-row justify-center gap-8 py-8">
      <CardLink type="client" />
      <CardLink type="vendor" />
    </div>
  );
}

export default Page;
