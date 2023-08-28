"use client";

import { cn } from "@/lib/utils";
import { Link } from "lucide-react";
import { Button, buttonVariants } from "./ui/Button";
import { signOut } from "next-auth/react";

export function SignIn() {
  return (
    <Link href="/sign-in" className={cn(buttonVariants({ size: "xs" }))}>
      Sign in
    </Link>
  );
}

export function SignOut() {
  return (
    <Button size="xs" onClick={() => signOut()}>
      Sign out
    </Button>
  );
}
