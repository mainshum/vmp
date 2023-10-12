import Link from "next/link";
import Icons from "./icons";
import { SignOut } from "./buttons";
import { Session } from "next-auth";
import { Nullalble } from "@/types/shared";

function Navbar({ session }: { session: Nullalble<Session> }) {
  return (
    <header className="fixed inset-x-0 top-0 z-[10] flex h-14 justify-center border-b border-zinc-300 bg-stone-100 py-2">
      <nav className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden md:block">VMP</p>
        </Link>
        {session && <SignOut sessionUser={session.user} />}
      </nav>
    </header>
  );
}

export default Navbar;
