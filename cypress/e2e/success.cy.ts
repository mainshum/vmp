import { ROUTES } from "../../src/lib/const";

describe("/success", () => {
  describe("?type=customer_registered", () => {
    it("should match type=customer_registered", () => {
      cy.visit("/success?type=customer_registered");
      cy.findByText(
        "You are now registered as VMP customer and ready to submit your first job posting.",
      ).should("exist");
    });
    it("should redirect to /client/postings when Get started clicked", () => {
      cy.visit("/success?type=customer_registered");
      cy.findByText("Get started").should("exist").click();

      cy.url().should("contain", ROUTES.CUSTOMER.REQUESTS);
    });
  });

  it("should match type=otherwise for ?type=[anything]", () => {
    cy.visit("/success?type=jdksjf");
    cy.findByText("Are you here by mistake?").should("exist");
  });
});
