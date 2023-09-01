import { DefaultSession } from "next-auth";
import { UserRole } from "./shared";
import { type CompanyDetails } from "../components/register";

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
    startViewTransition: (fn: CallableFunction) => void;
  }
  namespace Cypress {
    interface Cypress {
      mockCompanyDetails?: CompanyDetails;
    }
  }

  interface Window {
    Cypress?: Cypress.Cypress;
  }
}
