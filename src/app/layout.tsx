import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { nextAuthOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./providers";

export const metadata = {
  title: "VMP",
  description: "Virtual marketplace",
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(nextAuthOptions);

  return (
    <html
      lang="en"
      className={cn(
        "light bg-white text-slate-900 antialiased",
        inter.className,
      )}
    >
      <body className="min-h-screen antialiased">
        <NextAuthProvider>
          <Navbar session={session} />
          <main className="container h-full pt-14">{children}</main>
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}
