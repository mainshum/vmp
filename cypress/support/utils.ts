import { UserRole } from "../../src/types/shared";

export const testRedirect = (initUrl: string) => (finalUrl: string) => {
  cy.visit(initUrl, { failOnStatusCode: false });
  cy.url().should("contain", finalUrl);
};

export const roleToToken: Record<UserRole, string> = {
  client: Cypress.env("clientSessionToken"),
  vendor: Cypress.env("vendorSessionToken"),
  none: Cypress.env("noroleSessionToken"),
};

export const setSessionToken = (role: UserRole) =>
  cy.setCookie("next-auth.session-token", roleToToken[role]);
