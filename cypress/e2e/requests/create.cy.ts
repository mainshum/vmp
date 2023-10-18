import { ROUTES } from "../../../src/lib/const";
import { setSessionToken } from "../../support/utils";

describe("client postings", () => {
  beforeEach(() => {
    setSessionToken("CLIENT");
    cy.visit("/requests/create");
  });

  it("works", () => {});
});
