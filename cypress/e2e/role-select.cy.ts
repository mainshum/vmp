import { setSessionToken, testCommonRedirects } from "../support/utils";

describe("role-select", () => {
  testCommonRedirects();
  describe("happy path", () => {
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
