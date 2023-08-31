import { setSessionToken } from "../support/utils";

describe("client postings", () => {
  beforeEach(() => {
    setSessionToken("client");
  });

  it("renders 10 rows of postings (+1 header)", () => {
    cy.visit("/client");

    cy.findAllByRole("row").should("have.length", 11);
  });

  it("renders error boundary when ERROR occurs", () => {
    cy.on("uncaught:exception", () => false);
    cy.visit("/client?mockstate=error");

    cy.findByText("Something went wrong!").should("exist");
  });
});
