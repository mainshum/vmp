import { UserRole } from "../../src/types/shared";
import { setSessionToken, testRedirect } from "../support/utils";

const redirectFromRoleSelect = testRedirect("/role-select");

const toPostings = () => redirectFromRoleSelect("/postings");

describe("role-select", () => {
  it("redirects to siginin page if user not logged in", () => {
    redirectFromRoleSelect("/sign-in");
  });

  it("redirects to /client/register if user is registered as client", () => {
    setSessionToken("client");
    toPostings();
  });

  it("redirects to /vendor/register if user is registered as vendor", () => {
    setSessionToken("vendor");
    toPostings();
  });

  describe("happy state", () => {
    it("goes to /register?role=vendor if user clicks on Vendor", () => {
      setSessionToken("none");
      cy.visit("/role-select");
      cy.findByText("Vendor").should("exist").click();
      cy.url().should("contain", "/register?role=vendor");
    });
    it("goes to /register?role=client if user clicks on Client", () => {
      setSessionToken("none");
      cy.visit("/role-select");
      cy.findByText("Client").should("exist").click();
      cy.url().should("contain", "/register?role=client");
    });
  });
});
