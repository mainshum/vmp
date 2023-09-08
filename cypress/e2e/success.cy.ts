describe("/success", () => {
  it("should match type=customer_registered for ?type=customer_registered", () => {
    cy.visit("/success?type=customer_registered");
    cy.findByText(
      "You are now registered as VMP customer and ready to submit your first job posting.",
    ).should("exist");
  });

  it("should match type=otherwise for ?type=[anything]", () => {
    cy.visit("/success?type=jdksjf");
    cy.findByText(
      "Hard to say what kind of though... Are you here by mistake?",
    ).should("exist");
  });
});
