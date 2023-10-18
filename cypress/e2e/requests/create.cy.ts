import { ROUTES } from "../../../src/lib/const";
import { setSessionToken } from "../../support/utils";

describe("client postings", () => {
  beforeEach(() => {
    setSessionToken("CLIENT");
    cy.visit("/requests/create");
  });

  // bariery wejscia
  describe("auth", () => {});

  describe("form filling", () => {
    it("should fill empty form on page 1", () => {
      cy.findByLabelText("Consultant's profile").should("exist").click();

      cy.findByText("Data specialist", { selector: "span" })
        .should("exist")
        .click();

      cy.findByRole("slider")
        .should("exist")
        .click()
        .type("{leftArrow}{leftArrow}");

      cy.findByLabelText("Start date").should("exist").click();

      cy.findAllByRole("gridcell")
        .not("[disabled]")
        .first()
        .should("exist")
        .click();

      cy.findByLabelText("End date").should("exist").click();

      cy.wait(500);

      cy.findAllByRole("gridcell")
        .not("[disabled]")
        .eq(1)
        .should("exist")
        .click();

      cy.findByLabelText("Hourly rate").should("exist").type("1234");
      cy.findByLabelText("Notice period").should("exist").type("1234");

      cy.findByRole("checkbox", { name: "Domestic" }).should("exist").click();
      cy.findByRole("checkbox", { name: "International" })
        .should("exist")
        .click();
    });
  });
});
