import { ROUTES } from "../../src/lib/const";
import { setSessionToken } from "../support/utils";

describe("/role-select", () => {
  describe("init", () => {
    it(`redirects to ${ROUTES.SIGIN} if access by role=NONE`, () => {
      // TODO set role to client
      cy.findByText("Vendor").should("exist").click();
      cy.url().should("contain", "/register?role=vendor");
    });
    it(`redirects to ${ROUTES.CUSTOMER.POSTINGS} if access by role=CLIENT`, () => {
      // TODO set role to client
      cy.findByText("Vendor").should("exist").click();
      cy.url().should("contain", "/register?role=vendor");
    });

    it(`throws RoleNotImplemented if access by role not in {CLIENT, NONE}`, () => {
      // TODO set role to vendor
      cy.visit("/role-select");
      cy.findByText("Vendor").should("exist").click();
      cy.url().should("contain", "/register?role=vendor");
    });
  });

  describe("happy path", () => {
    it("goes to /register?role=vendor if user clicks on Vendor", () => {
      setSessionToken("NONE");
      cy.visit("/role-select");
      cy.findByText("Vendor").should("exist").click();
      cy.url().should("contain", "/register?role=vendor");
    });
    it("goes to /register?role=client if user clicks on Client", () => {
      setSessionToken("NONE");
      cy.visit("/role-select");
      cy.findByText("Client").should("exist").click();
      cy.url().should("contain", "/register?role=client");
    });
  });
});
