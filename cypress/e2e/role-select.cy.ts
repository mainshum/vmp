const testRedirect = (initUrl: string) => (finalUrl: string) => {
  cy.visit(initUrl, { failOnStatusCode: false });
  cy.url().should("contain", finalUrl);
};

const setSessionToken = () => {
  cy.setCookie("next-auth.session-token", Cypress.env("sessionToken"));
};

const redirectFromRoleSelect = testRedirect("/role-select");

describe("role-select", () => {
  // beforeEach(() => {
  //   cy.setCookie("next-auth.session-token", Cypress.env("sessionToken"));
  // });
  it("redirects to siginin page if user not logged in", () => {
    redirectFromRoleSelect("/sign-in");
  });

  it("redirects to /client/postings if user is registered as client", () => {
    redirectFromRoleSelect("/client/postings");
  });

  it("redirects to /vendor/postings if user is registered as vendor", () => {
    redirectFromRoleSelect("/vendor/postings");
  });

  describe("happy state", () => {
    beforeEach(() => {
      setSessionToken();
    });
    it.only("goes to /vendor/postings if user clicks on Vendor", () => {
      cy.visit("/role-select");
      cy.findByText("Vendor").should("exist").click();
      cy.url().should("contain", "/vendor/postings");
    });
    it.only("goes to /vendor/postings if user clicks on Client", () => {
      cy.visit("/role-select");
      cy.findByText("Client").should("exist").click();
      cy.url().should("contain", "/client/postings");
    });
  });
});
