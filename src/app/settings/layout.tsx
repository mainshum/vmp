import { Separator } from "@/components/ui/separator";
import { H2 } from "@/components/typography";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";

const links = [
  { name: "Company details", href: "" },
  { name: "Buyer details", href: "" },
  { name: "Company details", href: "" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="pb-6 pl-4 pt-8">
        <H2 className="pb-1">Settings</H2>
        <p>Manage your preferences</p>
      </div>
      <Separator />
      <div className="flex flex-col  gap-6 pt-6 md:flex-row">
        <nav className="flex flex-row md:flex-col">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start",
              )}
            >
              {l.name}
            </Link>
          ))}
        </nav>
        <div className="flex-grow px-4 pt-2">{children}</div>
      </div>
    </>
  );
}
