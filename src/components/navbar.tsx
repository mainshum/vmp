import Link from "next/link";
import Icons from "./icons";
import { UserCircle } from "lucide-react";
import { ROUTES } from "@/lib/const";
import { buttonVariants } from "./ui/button";
import { headers } from "next/headers";
import { getVMPSession } from "@/lib/auth";

async function Navbar() {
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path");
  const session = await getVMPSession();
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
            <UserCircle className="h-8 w-8 text-white" />
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
