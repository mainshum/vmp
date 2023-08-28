describe("client postings", () => {
  it("renders 10 rows of postings (+1 header)", () => {
    cy.visit("http://localhost:3000/client", {
      headers: {
        // "X-MOCK-STATE": "ERROR",
      },
    });

    cy.findAllByRole("row").should("have.length", 11);
  });

  it("renders error boundary when ERROR occurs", () => {
    cy.on("uncaught:exception", () => false);
    cy.visit("http://localhost:3000/client", {
      headers: {
        "X-MOCK-STATE": "ERROR",
      },
    });

    cy.findByText("Something went wrong!").should("exist");
  });
});
