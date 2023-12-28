/* eslint-disable no-unused-vars */
import { DefaultSession, AdapterUser } from "next-auth";
import { CompanyDetails, type BuyerDetails } from "../components/register";
import { VMPRole } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: VMPRole;
    };
  }
  interface User {
    role: VMPRole;
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
