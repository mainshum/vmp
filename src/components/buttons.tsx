"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

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
  console.log(sessionUser);
  return (
    <Avatar role="button" onClick={console.log}>
      <AvatarImage src={sessionUser.image ? sessionUser.image : undefined} />
      <AvatarFallback>
        {sessionUser.name ? initials(sessionUser.name) : "ME"}
      </AvatarFallback>
    </Avatar>
  );
}
