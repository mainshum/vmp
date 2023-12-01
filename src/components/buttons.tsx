"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ROUTES } from "@/lib/const";
import { LogOutIcon, Megaphone, Settings } from "lucide-react";

const initials = (nameSurname: string) =>
  nameSurname
    .split(" ")
    .filter((x) => x.length > 0)
    .map((x) => x[0]);

export function SignOut({
  sessionUser,
}: {
  sessionUser: Exclude<Session["user"], undefined>;
}) {
  return (
    <Avatar role="button">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AvatarImage
            src={sessionUser.image ? sessionUser.image : undefined}
          />
        </DropdownMenuTrigger>
        <DropdownMenuTrigger>
          <AvatarFallback>
            {sessionUser.name ? initials(sessionUser.name) : "ME"}
          </AvatarFallback>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.CUSTOMER.REQUESTS}>
              <Megaphone className="mr-2 h-4 w-4" />
              <span>Postings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.CUSTOMER.SETTINGS.COMPANY}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Avatar>
  );
}
