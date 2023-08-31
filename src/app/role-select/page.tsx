import { buttonVariants } from "@/components/ui/Button";
import { nextAuthOptions } from "@/lib/auth";
import { ROUTES } from "@/lib/const";
import { cn } from "@/lib/utils";
import { PageParams } from "@/types/next";
import { capitalize } from "@/lib/utils";
import { HeartHandshake, ShoppingCart } from "lucide-react";
import { Session, getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/shared";

function useUserRedirects(s: Session | null) {}

function CardLink({ type }: { type: "client" | "vendor" }) {
  const url = type === "client" ? "/client/register" : "/vendor/register";

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

const dbMock = {
  async findUserRole(email: string): Promise<UserRole> {
    return email.includes("vendor")
      ? "vendor"
      : email.includes("client")
      ? "client"
      : "none";
  },
};

async function Page(searchParams: PageParams) {
  const session = await getServerSession(nextAuthOptions);

  if (session == null) redirect("/sign-in");

  const role = await dbMock.findUserRole(session.user!.email!);

  if (role === "client") redirect("/client/postings");
  if (role === "vendor") redirect("/vendor/postings");

  return (
    <div className="flex flex-row justify-center gap-8 py-8">
      <CardLink type="client" />
      <CardLink type="vendor" />
    </div>
  );
}

export default Page;
