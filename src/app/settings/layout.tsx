import { Separator } from "@/components/ui/separator";
import { H2 } from "@/components/typography";
import { ROUTES } from "@/lib/const";
import Navbar from "./navbar";

const links = [
  { name: "Company details", href: `${ROUTES.CUSTOMER.SETTINGS.COMPANY}` },
  { name: "Buyer details", href: `${ROUTES.CUSTOMER.SETTINGS.BUYER}` },
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
      <div className="flex flex-col  gap-6 py-6 md:flex-row">
        <Navbar links={links} />
        <div className="flex-grow px-4 pt-2">{children}</div>
      </div>
    </>
  );
}
