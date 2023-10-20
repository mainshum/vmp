const roleToToken: Record<string, string> = {
  CLIENT: Cypress.env("clientSessionToken"),
  VENDOR: Cypress.env("vendorSessionToken"),
  NONE: Cypress.env("noroleSessionToken"),
  ADMIN: Cypress.env("noroleSessionToken"),
};

export const testRedirect = (initUrl: string) => (finalUrl: string) => {
  cy.visit(initUrl, { failOnStatusCode: false });
  cy.url().should("contain", finalUrl);
};

export const setSessionToken = (role: string) =>
  cy.setCookie("next-auth.session-token", roleToToken[role]);

export const testCommonRedirects = () => {
  const redirectFromRoleSelect = testRedirect("/role-select");
  const toPostings = () => redirectFromRoleSelect("/postings");

  describe("redirects", () => {
    it("redirects to siginin page if user not logged in", () => {
      redirectFromRoleSelect("/sign-in");
    });

    it("redirects to /postings if user is registered as client", () => {
      setSessionToken("CLIENT");
      toPostings();
    });

    it("redirects to /postings if user is registered as vendor", () => {
      setSessionToken("CLIENT");
      toPostings();
    });
  });
};
