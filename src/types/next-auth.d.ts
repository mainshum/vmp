import NextAuth, { DefaultSession } from "next-auth";
import { UserRole } from "./shared";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare global {
  interface Document {
    startViewTransition: (x: CallableFunction) => {};
  }
}
