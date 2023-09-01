import { setSessionToken, testCommonRedirects } from "../support/utils";

describe("register", () => {
  testCommonRedirects();

  describe("happy path:vendor", () => {
    beforeEach(() => {
      setSessionToken("none");
      cy.visit("/register?role=vendor");
    });

    it.only("shows <VendorRegistration/> if search params contains role=vendor", () => {
      cy.findByText("Vendor registration not implemented").should("exist");
    });
    it("displays form", () => {
      cy.findByRole("form").should("exist");
    });
  });
});
