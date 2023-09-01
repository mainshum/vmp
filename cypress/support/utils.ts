import { UserRole } from "../../src/types/shared";

const roleToToken: Record<UserRole, string> = {
  client: Cypress.env("clientSessionToken"),
  vendor: Cypress.env("vendorSessionToken"),
  none: Cypress.env("noroleSessionToken"),
};

export const testRedirect = (initUrl: string) => (finalUrl: string) => {
  cy.visit(initUrl, { failOnStatusCode: false });
  cy.url().should("contain", finalUrl);
};

export const setSessionToken = (role: UserRole) =>
  cy.setCookie("next-auth.session-token", roleToToken[role]);

export const testCommonRedirects = () => {
  const redirectFromRoleSelect = testRedirect("/role-select");
  const toPostings = () => redirectFromRoleSelect("/postings");

  describe("redirects", () => {
    it("redirects to siginin page if user not logged in", () => {
      redirectFromRoleSelect("/sign-in");
    });

    it("redirects to /postings if user is registered as client", () => {
      setSessionToken("client");
      toPostings();
    });

    it("redirects to /postings if user is registered as vendor", () => {
      setSessionToken("vendor");
      toPostings();
    });
  });
};
