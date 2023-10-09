import { ROUTES } from "../../src/lib/const";
import { setSessionToken } from "../support/utils";

describe("client postings", () => {
  beforeEach(() => {
    setSessionToken("CLIENT");
  });

  it.only("renders 10 rows of postings (+1 header)", () => {
    cy.visit(ROUTES.CUSTOMER.POSTINGS);

    cy.findAllByRole("row").should("have.length", 11);
  });

  it("renders error boundary when ERROR occurs", () => {
    cy.on("uncaught:exception", () => false);
    cy.visit(`${ROUTES.CUSTOMER.POSTINGS}?mockstate=error`);

    cy.findByText("Something went wrong!").should("exist");
  });
});
