export const MOCK_STATE_HEADER = "X-MOCK-STATE";

type SuccessType = "customer_registered";

export const ROUTES = {
  SIGIN: "/sign-in",
  ROLE_SELECT: "/role-select",
  CUSTOMER: {
    POSTINGS: "/customer",
    SETTINGS: {
      COMPANY: "/settings/company",
      BUYER: "/settings/buyer",
    },
  },
  SUCCESS: (t: SuccessType) => `/success?type=${t}`,
  API: {
    CLIENT_REGISTER: "/api/client/register",
    CUSTOMER: {
      POSTINGS: "/customer",
    },
  },
};
