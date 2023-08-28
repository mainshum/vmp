import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "VMP",
  description: "Virtual marketplace",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "light bg-white text-slate-900 antialiased",
        inter.className,
      )}
    >
      <body className="min-h-screen antialiased">
        <Navbar user={"LoggedIn"} />
        <main className="container h-full pt-12">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
