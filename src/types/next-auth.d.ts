import { DefaultSession, AdapterUser } from "next-auth";
import { CompanyDetails, type BuyerDetails } from "../components/register";
import { VMPRoleType } from "../../prisma/generated/zod";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: VMPRoleType;
    } & DefaultSession["user"];
  }
  interface User {
    role: VMPRoleType;
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
