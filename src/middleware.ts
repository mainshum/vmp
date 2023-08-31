import { withAuth } from "next-auth/middleware";
export const config = { matcher: ["/", "/client", "/api/auth/session"] };

export default withAuth;
