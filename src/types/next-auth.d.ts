import { DefaultSession } from "next-auth";
import { UserRole } from "./shared";
import { CompanyDetails, type BuyerDetails } from "../components/register";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
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
      mockBuyerDetails?: BuyerDetails;
    }
  }

  interface Window {
    Cypress?: Cypress.Cypress;
  }
}
