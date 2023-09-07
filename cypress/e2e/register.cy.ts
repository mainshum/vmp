import { setSessionToken, testCommonRedirects } from "../support/utils";

describe("register", () => {
  testCommonRedirects();

  describe("happy path:vendor", () => {
    it("shows <VendorRegistration/> if search params contains role=vendor", () => {
      setSessionToken("none");
      cy.visit("/register?role=vendor");
      cy.findByText("Vendor registration not implemented").should("exist");
    });
  });

  describe("client", () => {
    describe("registration form", () => {
      const textVisibleLazy = (txt: string) => () =>
        cy.findByText(txt).should("exist");

      const buyerRepr = "Buyer representative";
      const companyDetails = "Company details";

      const isRepresentativeBit = textVisibleLazy(buyerRepr);
      const isCompanyDetailsBit = textVisibleLazy(companyDetails);

      const isLastPage = textVisibleLazy("Finish registration");

      beforeEach(() => {
        setSessionToken("none");
      });

      const validationEr = "At least 2 characters.";

      // validation
      it(`should show ${validationEr} if clicking on next before filling in`, () => {
        cy.visit("/register?role=client");
        isCompanyDetailsBit();

        const checkValidation = (errsExpected: number) => {
          cy.findByText("Next").click();

          cy.findAllByText(validationEr).should("have.length", errsExpected);

          cy.findAllByRole("textbox")
            .should("have.length", errsExpected)
            // type in email as this is the only more specific text input
            .each(($el) => cy.wrap($el).type("d@gmail.com"));

          cy.findByText("Next").click();
        };

        checkValidation(4);

        isRepresentativeBit();
        checkValidation(5);
        isLastPage();
      });

      const setupForms = () => {
        Cypress.mockCompanyDetails = {
          address: "sfdajsdkfj",
          companyName: "sdjf",
          ndaPerson: "ksdf",
          taxId: "dss",
        };
        Cypress.mockBuyerDetails = {
          mail: "d@gmail.com",
          name: "sdf",
          phone: "sdfsdf",
          position: "sdf",
          surname: "sdfsdf",
        };
      };

      it("clicking Prev cycles back to the first page", () => {
        setupForms();
        cy.visit("/register?role=client");

        cy.findByText("Next").click();
        cy.findByText("Next").click();
        isLastPage();

        cy.findByText("Prev").click();
        isRepresentativeBit();
        cy.findByText("Prev").click();
        isCompanyDetailsBit();
      });
    });
  });
});
