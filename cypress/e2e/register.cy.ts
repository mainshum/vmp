import { setSessionToken, testCommonRedirects } from "../support/utils";
import { type FormDetails } from "../../src/components/register";

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

  describe.only("happy path:client", () => {
    const textVisibleLazy = (txt: string) => () =>
      cy.findByText(txt).should("exist");

    const buyerRepresentativeFormVisible = textVisibleLazy(
      "Buyer representative",
    );
    const companyDetailsFormVisible = textVisibleLazy("Company details");

    beforeEach(() => {
      setSessionToken("none");
    });
    it("clicking Next immediately shows 4 validation errors. when values filled with >2 chars Click takes to Buyer repr. form", () => {
      cy.visit("/register?role=client");
      companyDetailsFormVisible();
      cy.findByText("Next").click();

      cy.findAllByText("At least 2 characters.").should("have.length", 4);

      cy.findAllByRole("textbox")
        .should("have.length", 4)
        .each(($el) => cy.wrap($el).type("siemano"));

      cy.findByText("Next").click();
      buyerRepresentativeFormVisible();
      cy.findByText("Buyer representative").should("exist");
    });

    it("clicking Prev goes from Buyer repr. form to Company Details form", () => {
      Cypress.mockCompanyDetails = {
        address: "sfdajsdkfj",
        companyName: "sdjf",
        ndaPerson: "ksdf",
        taxId: "dss",
        // mail: "doseit@gmail.com",
        // name: "steven",
        // surname: "seagal",
        // phone: "793",
        // position: "sdfsdf",
      };
      cy.visit("/register?role=client");

      cy.findByText("Next").click();
      buyerRepresentativeFormVisible();
    });
  });
});
