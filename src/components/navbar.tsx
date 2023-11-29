import Link from "next/link";
import Icons from "./icons";
import { UserCircle } from "lucide-react";

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-[10] flex justify-center border-b bg-black py-2">
      <nav className="flex w-full items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <Icons.logo />
          <p className="hidden text-2xl font-bold tracking-widest text-white md:block">
            VMP
          </p>
        </Link>
        <UserCircle className="h-8 w-8 text-white" />
      </nav>
    </header>
  );
}

export default Navbar;
