import { UserRole } from "../../src/types/shared";
import { setSessionToken, testRedirect } from "../support/utils";

const redirectFromRoleSelect = testRedirect("/role-select");

describe("role-select", () => {
  it("redirects to siginin page if user not logged in", () => {
    redirectFromRoleSelect("/sign-in");
  });

  it("redirects to /client/register if user is registered as client", () => {
    setSessionToken("client");
    redirectFromRoleSelect("/client/postings");
  });

  it("redirects to /vendor/register if user is registered as vendor", () => {
    setSessionToken("vendor");
    redirectFromRoleSelect("/vendor/postings");
  });

  describe("happy state", () => {
    it("goes to /vendor/register if user clicks on Vendor", () => {
      setSessionToken("none");
      cy.visit("/role-select");
      cy.findByText("Vendor").should("exist").click();
      cy.url().should("contain", "/vendor/register");
    });
    it("goes to /vendor/register if user clicks on Client", () => {
      setSessionToken("none");
      cy.visit("/role-select");
      cy.findByText("Client").should("exist").click();
      cy.url().should("contain", "/client/register");
    });
  });
});
