import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { getVMPSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { NextAuthProvider, TenstackProvider } from "./providers";

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
    <html
      lang="en"
      className={cn(
        "light bg-white text-slate-900 antialiased",
        inter.className,
      )}
    >
      <body className="min-h-screen antialiased">
        <NextAuthProvider>
          <TenstackProvider>
            <Navbar />
            <main className="container h-full pt-[56px]">{children}</main>
            <Toaster />
          </TenstackProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
