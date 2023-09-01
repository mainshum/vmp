import {
  setSessionToken,
  testCommonRedirects,
  testRedirect,
} from "../support/utils";

const redirectFromRoleSelect = testRedirect("/register");

const toPostings = () => redirectFromRoleSelect("/postings");

describe("register", () => {
  testCommonRedirects();
  describe("happy path", () => {});
});
