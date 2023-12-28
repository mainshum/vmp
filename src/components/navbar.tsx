import Link from "next/link";
import Icons from "./icons";
import { LogOutIcon, Megaphone, UserCircle } from "lucide-react";
import { ROUTES } from "@/lib/const";
import { buttonVariants } from "./ui/button";
import { headers } from "next/headers";
import { NextSession } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { User } from "./navbar-user";

function Navbar({ session }: { session: NextSession }) {
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path");
  return (
    <header className="fixed inset-x-0 top-0 z-[10] flex h-[56px] justify-center border-b bg-black py-2">
      <nav className="flex w-full items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <Icons.logo />
          <p className="hidden text-2xl font-bold tracking-widest text-white md:block">
            VMP
          </p>
        </Link>
        <div className="flex items-center gap-4">
          {pathname === ROUTES.CUSTOMER.REQUESTS.LIST && (
            <Link
              className={buttonVariants()}
              href={ROUTES.CUSTOMER.REQUESTS.CREATE}
            >
              New request
            </Link>
          )}
          {session ? (
            <User session={session} />
          ) : (
            <Link className={buttonVariants()} href={ROUTES.SIGIN}>
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
