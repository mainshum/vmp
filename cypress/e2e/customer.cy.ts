const typeIntoInput = (labelTxt: string, input: string) => {
  cy.findByLabelText(labelTxt).should("exist").click().type(input);
};

const selectFromCal = (labelTxt: string, cellInd: number) => {
  cy.findByLabelText(labelTxt)
    .should("exist")
    .click({ waitForAnimations: true });

  cy.wait(500);

  cy.findAllByRole("gridcell")
    .not("[disabled]")
    .eq(cellInd)
    .should("exist")
    .click();
};

const selectFromDrop = (labelTxt: string, selectText: string) => {
  cy.findByLabelText(labelTxt).should("exist").click();
  cy.findByText(selectText, { selector: "span" }).should("exist").click();
};

const fillForm = (skipName: boolean = false, skipProfile: boolean = false) => {
  cy.findByText("Create new request").click().should("exist");

  cy.findByRole("dialog").should("be.visible");

  // profile
  if (!skipProfile) {
    selectFromDrop("Consultant's profile", "DEVOPS");
  }

  // hourly rate
  typeIntoInput("Hourly rate", "876");

  // availability
  cy.findByRole("slider")
    .should("exist")
    .click()
    .type("{leftArrow}{leftArrow}");

  // start
  selectFromCal("Start date", 0);

  // end
  selectFromCal("End date", 0);

  // notice
  typeIntoInput("Notice period", "18");

  selectFromDrop("Work location", "FULLY_REMOTE");

  if (!skipName) {
    typeIntoInput("Project name", "Some project");
  }

  selectFromDrop("Project maturity", "NEW");
  selectFromDrop("Project duration", "SHORT");
  selectFromDrop("Project methodology", "LEAN");

  typeIntoInput("Project description", "Steven seagal");
};

describe("client postings", () => {
  beforeEach(() => {
    // cy.intercept({
    //   method: "POST",
    //   url: "/api/requests",
    // });

    cy.visit("/customer");
  });

  // bariery wejscia
  describe("auth", () => {});

  describe("draft filling", () => {
    beforeEach(() => {});

    it("is not allowed when request name is empty", () => {
      fillForm(true, false);
      cy.findByText("Save as draft").click();

      cy.findByLabelText("Project name")
        .should("exist")
        .then(($el) =>
          cy.wrap($el).siblings("p:last-child").contains("Minimum"),
        );
    });

    it("is allowed when request name is filled", () => {
      fillForm(true);

      cy.findByText("Save as draft").click();

      typeIntoInput("Project name", "Demo request");

      cy.findByText("Save as draft").click();

      cy.findByText("Saved successfully").should("exist");
    });
  });

  describe("full request filling", () => {
    const useTableRows = (fn: (el: JQuery<HTMLElement>) => void) => {
      cy.findByRole("table").findAllByRole("row").then(fn);
    };

    it.only("should fill empty", () => {
      useTableRows(($rowsInit) => {
        const initialCount = $rowsInit.length;
        cy.log(`Rows init: ${initialCount}`);
        fillForm();
        cy.findByText("Submit request").click();

        cy.findByRole("table")
          .findAllByRole("row")
          .should("have.length", initialCount + 1);
      });
    });
  });
});
