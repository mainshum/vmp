import { ROUTES } from "../../src/lib/const";
import {} from "nanoid";

it("rendering: request not found", () => {
  cy.intercept("GET");
  cy.visit(ROUTES.VENDOR.OFFERS.CREATE("6bbdb131-3e2a-48cb-b43e-066bfac8d10c"));
});
