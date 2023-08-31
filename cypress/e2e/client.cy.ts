describe("client postings", () => {
  beforeEach(() => {
    cy.setCookie("next-auth.session-token", Cypress.env("sessionToken"));
  });
  it("renders 10 rows of postings (+1 header)", () => {
    cy.visit("http://localhost:3000/client");

    cy.findAllByRole("row").should("have.length", 11);
  });

  it("renders error boundary when ERROR occurs", () => {
    cy.on("uncaught:exception", () => false);
    cy.visit("http://localhost:3000/client?mockstate=error");

    cy.findByText("Something went wrong!").should("exist");
  });
});
