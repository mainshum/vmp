"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar({ links }: { links: { href: string; name: string }[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row md:flex-col">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === l.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {l.name}
        </Link>
      ))}
    </nav>
  );
}

export default Navbar;
