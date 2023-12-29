"use client";

import { NextSession } from "@/lib/auth";
import { ROUTES } from "@/lib/const";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  UserCircle,
  LogOutIcon,
  Megaphone,
  Percent,
  Settings,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const User = ({ session }: { session: Exclude<NextSession, null> }) => {
  const router = useRouter();
  const { role } = session.user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserCircle className="h-8 w-8 text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="[&>[role='menuitem']]:cursor-pointer"
        align="end"
      >
        {(role == "ADMIN" || role == "VENDOR") && (
          <DropdownMenuItem
            onClick={() => router.push(ROUTES.VENDOR.REQUESTS.LIST)}
          >
            <Percent className="mr-2 h-4 w-4" />
            <span>Offers</span>
          </DropdownMenuItem>
        )}

        {(role == "ADMIN" || role == "CLIENT") && (
          <DropdownMenuItem onClick={() => router.push(ROUTES.REQUESTS.LIST)}>
            <Megaphone className="mr-2 h-4 w-4" />
            <span>Requests</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem disabled className="opacity-50">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
