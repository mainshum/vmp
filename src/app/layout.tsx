import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getVMPSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./providers";
import { TrpcProvider } from "@/components/trpc-provider";

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
  const session = await getVMPSession();

  return (
    <TrpcProvider>
      <html
        lang="en"
        className={cn(
          "light bg-white text-slate-900 antialiased",
          inter.className,
        )}
      >
        <body className="min-h-screen antialiased">
          <ReactQueryDevtools />
          <NextAuthProvider>
            <Navbar session={session} />
            <main className="pt-[56px]">{children}</main>
            <Toaster />
          </NextAuthProvider>
        </body>
      </html>
    </TrpcProvider>
  );
}
