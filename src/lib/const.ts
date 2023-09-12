export const MOCK_STATE_HEADER = "X-MOCK-STATE";

type SuccessType = "customer_registered";

export const ROUTES = {
  SIGIN: "/sign-in",
  ROLE_SELECT: "/role-select",
  CLIENT: {
    POSTINGS: "/client",
    SETTINGS: "/settings",
  },
  SUCCESS: (t: SuccessType) => `/success?type=${t}`,
  API: {
    CLIENT_REGISTER: "/api/client/register",
  },
};
