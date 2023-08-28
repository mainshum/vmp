import GP from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

export const nextAuthOptions: NextAuthOptions = {
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GP({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};
