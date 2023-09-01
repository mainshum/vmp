import { setSessionToken, testCommonRedirects } from "../support/utils";
import { type CompanyDetails } from "../../src/components/register";

describe("register", () => {
  testCommonRedirects();

  describe("happy path:vendor", () => {
    beforeEach(() => {
      setSessionToken("none");
      cy.visit("/register?role=vendor");
    });

    it("shows <VendorRegistration/> if search params contains role=vendor", () => {
      cy.findByText("Vendor registration not implemented").should("exist");
    });
  });

  describe("happy path:client", () => {
    beforeEach(() => {
      setSessionToken("none");
    });
    it("clicking Next immediately shows 4 validation errors. when values filled with >2 chars Click takes to next form pagee", () => {
      cy.visit("/register?role=client");
      cy.findByText("Next").click();

      cy.findAllByText("Required").should("have.length", 4);

      cy.findAllByRole("textbox")
        .should("have.length", 4)
        .each(($el) => cy.wrap($el).type("siemano"));

      cy.findByText("Next").click();
      cy.findByText("Buyer representative").should("exist");
    });

    it.only("dupa", () => {
      Cypress.mockCompanyDetails = {
        address: "sfdajsdkfj",
        companyName: "sdjf",
        ndaPerson: "k",
        taxId: "dss",
      };
      cy.visit("/register?role=client");
    });
  });
});
